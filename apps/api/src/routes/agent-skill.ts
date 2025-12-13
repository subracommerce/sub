import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../middleware/auth";

const createSkillSchema = z.object({
  agentId: z.string().uuid(),
  skillType: z.enum(["search", "compare", "negotiate", "execute"]),
  level: z.number().int().min(1).max(10).optional(),
  metadata: z.record(z.any()).optional(),
});

const updateSkillSchema = z.object({
  level: z.number().int().min(1).max(10).optional(),
  experience: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export const agentSkillRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all skills for an agent
  fastify.get(
    "/agent/:agentId/skills",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId } = request.params as { agentId: string };

        // Verify agent belongs to user
        const agent = await fastify.prisma.agent.findFirst({
          where: {
            id: agentId,
            userId: request.userId,
          },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: "Agent not found",
          });
        }

        const skills = await fastify.prisma.agentSkill.findMany({
          where: { agentId },
          orderBy: { skillType: "asc" },
        });

        return reply.send({
          success: true,
          data: {
            agentId,
            agentName: agent.name,
            skills,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to get agent skills",
        });
      }
    }
  );

  // Create a new skill for an agent
  fastify.post(
    "/agent/skill",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId, skillType, level, metadata } =
          createSkillSchema.parse(request.body);

        // Verify agent belongs to user
        const agent = await fastify.prisma.agent.findFirst({
          where: {
            id: agentId,
            userId: request.userId,
          },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: "Agent not found",
          });
        }

        // Check if skill already exists
        const existingSkill = await fastify.prisma.agentSkill.findUnique({
          where: {
            agentId_skillType: {
              agentId,
              skillType,
            },
          },
        });

        if (existingSkill) {
          return reply.status(400).send({
            success: false,
            error: `Agent already has ${skillType} skill`,
          });
        }

        // Create skill
        const skill = await fastify.prisma.agentSkill.create({
          data: {
            agentId,
            skillType,
            level: level || 1,
            experience: 0,
            isActive: true,
            metadata: metadata || {},
          },
        });

        fastify.log.info(
          `Created ${skillType} skill for agent ${agentId} at level ${skill.level}`
        );

        return reply.status(201).send({
          success: true,
          data: skill,
        });
      } catch (error: any) {
        fastify.log.error(error);
        if (error.name === "ZodError") {
          return reply.status(400).send({
            success: false,
            error: error.errors[0].message,
          });
        }
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to create skill",
        });
      }
    }
  );

  // Update a skill
  fastify.patch(
    "/agent/skill/:skillId",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { skillId } = request.params as { skillId: string };
        const updates = updateSkillSchema.parse(request.body);

        // Get skill and verify ownership
        const skill = await fastify.prisma.agentSkill.findUnique({
          where: { id: skillId },
          include: {
            agent: {
              select: { userId: true, name: true },
            },
          },
        });

        if (!skill) {
          return reply.status(404).send({
            success: false,
            error: "Skill not found",
          });
        }

        if (skill.agent.userId !== request.userId) {
          return reply.status(403).send({
            success: false,
            error: "Not authorized",
          });
        }

        // Update skill
        const updatedSkill = await fastify.prisma.agentSkill.update({
          where: { id: skillId },
          data: updates,
        });

        fastify.log.info(`Updated skill ${skillId} for agent ${skill.agentId}`);

        return reply.send({
          success: true,
          data: updatedSkill,
        });
      } catch (error: any) {
        fastify.log.error(error);
        if (error.name === "ZodError") {
          return reply.status(400).send({
            success: false,
            error: error.errors[0].message,
          });
        }
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to update skill",
        });
      }
    }
  );

  // Delete a skill
  fastify.delete(
    "/agent/skill/:skillId",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { skillId } = request.params as { skillId: string };

        // Get skill and verify ownership
        const skill = await fastify.prisma.agentSkill.findUnique({
          where: { id: skillId },
          include: {
            agent: {
              select: { userId: true },
            },
          },
        });

        if (!skill) {
          return reply.status(404).send({
            success: false,
            error: "Skill not found",
          });
        }

        if (skill.agent.userId !== request.userId) {
          return reply.status(403).send({
            success: false,
            error: "Not authorized",
          });
        }

        // Delete skill
        await fastify.prisma.agentSkill.delete({
          where: { id: skillId },
        });

        fastify.log.info(`Deleted skill ${skillId}`);

        return reply.send({
          success: true,
          message: "Skill deleted successfully",
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to delete skill",
        });
      }
    }
  );

  // Add experience to a skill (for progression)
  fastify.post(
    "/agent/skill/:skillId/experience",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { skillId } = request.params as { skillId: string };
        const { amount } = z
          .object({ amount: z.number().int().positive() })
          .parse(request.body);

        // Get skill and verify ownership
        const skill = await fastify.prisma.agentSkill.findUnique({
          where: { id: skillId },
          include: {
            agent: {
              select: { userId: true },
            },
          },
        });

        if (!skill) {
          return reply.status(404).send({
            success: false,
            error: "Skill not found",
          });
        }

        if (skill.agent.userId !== request.userId) {
          return reply.status(403).send({
            success: false,
            error: "Not authorized",
          });
        }

        // Add experience
        const newExperience = skill.experience + amount;
        const experiencePerLevel = 100; // 100 XP per level
        const newLevel = Math.min(
          Math.floor(newExperience / experiencePerLevel) + 1,
          10 // Max level 10
        );

        const updatedSkill = await fastify.prisma.agentSkill.update({
          where: { id: skillId },
          data: {
            experience: newExperience,
            level: newLevel,
          },
        });

        const leveledUp = newLevel > skill.level;

        fastify.log.info(
          `Added ${amount} XP to skill ${skillId}. ${
            leveledUp ? `Leveled up to ${newLevel}!` : ""
          }`
        );

        return reply.send({
          success: true,
          data: {
            skill: updatedSkill,
            leveledUp,
            experienceGained: amount,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to add experience",
        });
      }
    }
  );

  // Initialize default skills for an agent
  fastify.post(
    "/agent/:agentId/skills/initialize",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId } = request.params as { agentId: string };

        // Verify agent belongs to user
        const agent = await fastify.prisma.agent.findFirst({
          where: {
            id: agentId,
            userId: request.userId,
          },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: "Agent not found",
          });
        }

        // Check if skills already exist
        const existingSkills = await fastify.prisma.agentSkill.count({
          where: { agentId },
        });

        if (existingSkills > 0) {
          return reply.status(400).send({
            success: false,
            error: "Agent already has skills",
          });
        }

        // Create all 4 basic skills
        const skillTypes: Array<"search" | "compare" | "negotiate" | "execute"> =
          ["search", "compare", "negotiate", "execute"];

        const skills = await Promise.all(
          skillTypes.map((skillType) =>
            fastify.prisma.agentSkill.create({
              data: {
                agentId,
                skillType,
                level: 1,
                experience: 0,
                isActive: true,
              },
            })
          )
        );

        fastify.log.info(`Initialized all skills for agent ${agentId}`);

        return reply.status(201).send({
          success: true,
          data: {
            agentId,
            agentName: agent.name,
            skills,
            message: "All skills initialized successfully",
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to initialize skills",
        });
      }
    }
  );
};

