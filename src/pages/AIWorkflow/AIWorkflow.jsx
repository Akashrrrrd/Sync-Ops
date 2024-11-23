import React, { useReducer, useState, useCallback, useMemo } from "react";
import "./AIWorkflow.css";

// Advanced Workflow Management Reducer
const initialState = {
  workflows: [],
  selectedWorkflow: null,
  analytics: {
    totalWorkflows: 0,
    completedWorkflows: 0,
    averageAIScore: 0,
    totalTasks: 0,
    completedTasks: 0,
  },
};

const workflowReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_WORKFLOW":
      const newWorkflow = {
        id: Date.now(),
        name: `AI Workflow ${state.workflows.length + 1}`,
        description: "",
        tasks: [],
        status: "PLANNING",
        priority: "MEDIUM",
        aiScore: 0,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
      return {
        ...state,
        workflows: [...state.workflows, newWorkflow],
        selectedWorkflow: newWorkflow,
        analytics: {
          ...state.analytics,
          totalWorkflows: state.analytics.totalWorkflows + 1,
        },
      };

    case "ADD_TASK":
      if (!state.selectedWorkflow) return state;
      const newTask = {
        id: Date.now(),
        name: `Task ${state.selectedWorkflow.tasks.length + 1}`,
        description: "",
        type: "COGNITIVE",
        status: "PENDING",
        priority: "MEDIUM",
        complexity: "STANDARD",
        assignedTo: null,
        estimatedTime: null,
        createdAt: new Date(),
      };
      return {
        ...state,
        selectedWorkflow: {
          ...state.selectedWorkflow,
          tasks: [...state.selectedWorkflow.tasks, newTask],
          lastUpdated: new Date(),
        },
        analytics: {
          ...state.analytics,
          totalTasks: state.analytics.totalTasks + 1,
        },
      };

    case "UPDATE_TASK":
      return {
        ...state,
        selectedWorkflow: {
          ...state.selectedWorkflow,
          tasks: state.selectedWorkflow.tasks.map((task) =>
            task.id === action.payload.id
              ? { ...task, ...action.payload.updates, updatedAt: new Date() }
              : task
          ),
          lastUpdated: new Date(),
        },
      };

    case "SELECT_WORKFLOW":
      return {
        ...state,
        selectedWorkflow: action.payload,
      };

    default:
      return state;
  }
};

const AIWorkflowPlatform = () => {
  const [state, dispatch] = useReducer(workflowReducer, initialState);
  const [view, setView] = useState("workflows");

  const createWorkflow = useCallback(() => {
    dispatch({ type: "CREATE_WORKFLOW" });
  }, []);

  const addTask = useCallback(() => {
    dispatch({ type: "ADD_TASK" });
  }, []);

  const updateTaskStatus = useCallback((taskId, updates) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: taskId,
        updates,
      },
    });
  }, []);

  const selectWorkflow = useCallback((workflow) => {
    dispatch({
      type: "SELECT_WORKFLOW",
      payload: workflow,
    });
  }, []);

  const workflowStats = useMemo(() => {
    const completedTasks = state.selectedWorkflow
      ? state.selectedWorkflow.tasks.filter(
          (task) => task.status === "COMPLETED"
        ).length
      : 0;

    return {
      totalTasks: state.selectedWorkflow
        ? state.selectedWorkflow.tasks.length
        : 0,
      completedTasks,
      completionPercentage: state.selectedWorkflow
        ? Math.round(
            (completedTasks / state.selectedWorkflow.tasks.length) * 100
          )
        : 0,
    };
  }, [state.selectedWorkflow]);

  return (
    <div className="workworkflow-container">
      <header className="workworkflow-header">
        <h1>AI Workflow Intelligence</h1>
        <div className="workworkflow-header-stats">
          <span>Total Workflows: {state.workflows.length}</span>
          <span>
            Active Workflows:{" "}
            {state.workflows.filter((w) => w.status !== "COMPLETED").length}
          </span>
        </div>
      </header>

      <nav className="workworkflow-navigation">
        <button
          onClick={() => setView("workflows")}
          className={view === "workflows" ? "active" : ""}
        >
          Workflows
        </button>
        <button
          onClick={() => setView("analytics")}
          className={view === "analytics" ? "active" : ""}
        >
          Analytics
        </button>
      </nav>

      <main className="workworkflow-content">
        {view === "workflows" ? (
          <section className="workworkflow-management">
            <div className="workworkflow-actions">
              <button onClick={createWorkflow}>Create Workflow</button>
              <button onClick={addTask} disabled={!state.selectedWorkflow}>
                Add Task
              </button>
            </div>

            <div className="workworkflow-grid">
              {state.workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`workworkflow-card ${
                    state.selectedWorkflow?.id === workflow.id ? "selected" : ""
                  }`}
                  onClick={() => selectWorkflow(workflow)}
                >
                  <h3>{workflow.name}</h3>
                  <div className="workworkflow-details">
                    <span>Status: {workflow.status}</span>
                    <span>Tasks: {workflow.tasks.length}</span>
                    <span>AI Score: {workflow.aiScore}%</span>
                  </div>
                </div>
              ))}
            </div>

            {state.selectedWorkflow && (
              <div className="workworkflow-task-panel">
                <h2>{state.selectedWorkflow.name} Tasks</h2>
                <div className="workworkflow-stats">
                  <span>Total Tasks: {workflowStats.totalTasks}</span>
                  <span>Completed: {workflowStats.completedTasks}</span>
                  <span>Completion: {workflowStats.completionPercentage}%</span>
                </div>
                <div className="worktask-list">
                  {state.selectedWorkflow.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`worktask-item ${task.status.toLowerCase()}`}
                      onClick={() =>
                        updateTaskStatus(task.id, {
                          status:
                            task.status === "PENDING"
                              ? "IN_PROGRESS"
                              : task.status === "IN_PROGRESS"
                              ? "COMPLETED"
                              : "PENDING",
                        })
                      }
                    >
                      {task.name} - {task.status}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="workworkflow-analytics">
            <div className="workanalytics-summary">
              <div className="workanalytics-card">
                <h3>Total Workflows</h3>
                <div className="workanalytics-value">{state.workflows.length}</div>
              </div>
              <div className="workanalytics-card">
                <h3>Completed Workflows</h3>
                <div className="workanalytics-value">
                  {
                    state.workflows.filter((w) => w.status === "COMPLETED")
                      .length
                  }
                </div>
              </div>
              <div className="workanalytics-card">
                <h3>Total Tasks</h3>
                <div className="workanalytics-value">
                  {state.workflows.reduce(
                    (total, workflow) => total + workflow.tasks.length,
                    0
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AIWorkflowPlatform;
