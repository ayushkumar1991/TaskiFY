"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Enhanced error handling wrapper
function withErrorHandling(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error in ${fn.name}:`, error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  };
}

// Enhanced authentication check
function requireAuth() {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized - Please sign in");
  }
  return { userId, orgId };
}

// Enhanced issue creation with better error handling
export const createIssueEnhanced = withErrorHandling(async function createIssueEnhanced(projectId, data) {
  const { userId, orgId } = requireAuth();

  // Input validation
  if (!data.title?.trim()) {
    throw new Error("Issue title is required");
  }

  if (!data.status || !["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].includes(data.status)) {
    throw new Error("Valid status is required");
  }

  if (!data.priority || !["LOW", "MEDIUM", "HIGH", "URGENT"].includes(data.priority)) {
    throw new Error("Valid priority is required");
  }

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  // Verify project access
  const project = await db.project.findFirst({
    where: { 
      id: projectId, 
      organizationId: orgId 
    }
  });

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.issue.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId || null,
      reporterId: user.id,
      assigneeId: data.assigneeId || null,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  // Revalidate relevant paths
  revalidatePath(`/project/${projectId}`);
  if (data.sprintId) {
    revalidatePath(`/sprint/${data.sprintId}`);
  }

  return {
    success: true,
    data: issue,
    message: "Issue created successfully"
  };
});

// Enhanced issue update with validation
export const updateIssueEnhanced = withErrorHandling(async function updateIssueEnhanced(issueId, data) {
  const { userId, orgId } = requireAuth();

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.project.organizationId !== orgId) {
    throw new Error("Access denied");
  }

  // Prepare update data with validation
  const updateData = {};
  
  if (data.title !== undefined) {
    if (!data.title.trim()) {
      throw new Error("Title cannot be empty");
    }
    updateData.title = data.title.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description?.trim() || null;
  }

  if (data.status !== undefined) {
    if (!["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].includes(data.status)) {
      throw new Error("Invalid status");
    }
    updateData.status = data.status;
  }

  if (data.priority !== undefined) {
    if (!["LOW", "MEDIUM", "HIGH", "URGENT"].includes(data.priority)) {
      throw new Error("Invalid priority");
    }
    updateData.priority = data.priority;
  }

  if (data.assigneeId !== undefined) {
    updateData.assigneeId = data.assigneeId;
  }

  const updatedIssue = await db.issue.update({
    where: { id: issueId },
    data: updateData,
    include: {
      assignee: true,
      reporter: true,
    },
  });

  // Revalidate paths
  revalidatePath(`/project/${issue.projectId}`);
  if (issue.sprintId) {
    revalidatePath(`/sprint/${issue.sprintId}`);
  }

  return {
    success: true,
    data: updatedIssue,
    message: "Issue updated successfully"
  };
});

// Enhanced bulk operations
export const bulkUpdateIssues = withErrorHandling(async function bulkUpdateIssues(issueIds, updates) {
  const { userId, orgId } = requireAuth();

  if (!Array.isArray(issueIds) || issueIds.length === 0) {
    throw new Error("Issue IDs are required");
  }

  // Verify all issues belong to user's organization
  const issues = await db.issue.findMany({
    where: { 
      id: { in: issueIds },
    },
    include: { project: true },
  });

  const invalidIssues = issues.filter(issue => issue.project.organizationId !== orgId);
  if (invalidIssues.length > 0) {
    throw new Error("Access denied to some issues");
  }

  // Perform bulk update
  const result = await db.issue.updateMany({
    where: { id: { in: issueIds } },
    data: updates,
  });

  // Revalidate affected project paths
  const projectIds = [...new Set(issues.map(issue => issue.projectId))];
  projectIds.forEach(projectId => {
    revalidatePath(`/project/${projectId}`);
  });

  return {
    success: true,
    updated: result.count,
    message: `${result.count} issues updated successfully`
  };
});

// Analytics helper function
export const trackUserAction = withErrorHandling(async function trackUserAction(action, metadata = {}) {
  const { userId, orgId } = requireAuth();
  
  // In a real implementation, you would store this in a separate analytics table
  console.log('User Action:', {
    userId,
    orgId,
    action,
    metadata,
    timestamp: new Date().toISOString()
  });

  return { success: true };
});