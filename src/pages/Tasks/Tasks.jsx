import React, { useState, useEffect } from "react";
import "./Tasks.css";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";

const REACT_APP_GEMINI_API_KEY = "AIzaSyCFtYlPZVjqZuE6si1piEshIVbFmBfLy7g";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${REACT_APP_GEMINI_API_KEY}`;

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

const summarizeTask = async (taskDetails) => {
  try {
    const prompt = `Provide a detailed, step-by-step task breakdown for an employee. 
    Analyze the following task details and generate a comprehensive action plan:
    
    Task Title: ${taskDetails.title}
    Priority: ${taskDetails.priority}
    Deadline: ${taskDetails.deadline}
    
    Develop a thorough, professional guide explaining exactly what the employee needs to do to successfully complete this task. Include:
    - Specific action steps
    - Potential challenges
    - Recommended approach
    - Key deliverables
    - Time management suggestions
    
    Format your response in Markdown for better readability.
    Your response should be clear, actionable, and tailored to help the employee understand and execute the task effectively.`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    };

    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const summary =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary could be generated.";
    return summary.trim();
  } catch (error) {
    console.error(
      "Error summarizing task:",
      error.response?.data || error.message
    );
    return "Unable to generate summary. Please try again later.";
  }
};

const generateSuggestions = (currentTasks) => {
  return currentTasks.length > 0
    ? "Consider prioritizing high-priority tasks and checking upcoming deadlines."
    : "No suggestions available. Add some tasks to get started!";
};

// Component to render sanitized markdown content
const SafeMarkdown = ({ content }) => {
  const createMarkup = () => {
    const rawMarkup = marked(content);
    return { __html: DOMPurify.sanitize(rawMarkup) };
  };

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
};

const Tasks = () => {
  // Load tasks from localStorage on initial render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          {
            id: 1,
            title: "Design UI",
            assignee: "John Doe",
            priority: "High",
            deadline: "2024-10-15",
            status: "Completed",
          },
          {
            id: 2,
            title: "Develop API",
            assignee: "Jane Smith",
            priority: "Medium",
            deadline: "2024-10-20",
            status: "Pending",
          },
          {
            id: 3,
            title: "Write Documentation",
            assignee: "Alice Brown",
            priority: "Low",
            deadline: "2024-10-25",
            status: "In Progress",
          },
          {
            id: 4,
            title: "Test Application",
            assignee: "Mark Johnson",
            priority: "High",
            deadline: "2024-10-18",
            status: "Pending",
          },
          {
            id: 5,
            title: "Fix Bugs",
            assignee: "Sarah Lee",
            priority: "Medium",
            deadline: "2024-10-22",
            status: "In Progress",
          },
          {
            id: 6,
            title: "Deploy to Production",
            assignee: "Chris Evans",
            priority: "High",
            deadline: "2024-10-30",
            status: "Pending",
          },
        ];
  });

  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    priority: "Low",
    deadline: "",
    status: "Pending",
  });
  const [filter, setFilter] = useState("All");
  const [taskSummaries, setTaskSummaries] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState({});

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (
      newTask.title.trim() &&
      newTask.assignee.trim() &&
      newTask.deadline.trim()
    ) {
      const newTaskWithId = {
        ...newTask,
        id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      };
      setTasks([...tasks, newTaskWithId]);
      resetNewTask();
    }
  };

  const resetNewTask = () => {
    setNewTask({
      title: "",
      assignee: "",
      priority: "Low",
      deadline: "",
      status: "Pending",
    });
  };

  const changeStatus = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleSummarize = async (task) => {
    setIsLoading((prev) => ({ ...prev, [task.id]: true }));

    try {
      const summary = await summarizeTask(task);
      setTaskSummaries((prevSummaries) => ({
        ...prevSummaries,
        [task.id]: summary,
      }));
    } catch (error) {
      console.error("Summarization failed:", error);
      setTaskSummaries((prevSummaries) => ({
        ...prevSummaries,
        [task.id]: "Failed to generate summary. Please try again.",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, [task.id]: false }));
    }
  };

  const handleSuggestion = () => {
    setSuggestion(generateSuggestions(tasks));
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All" ? true : task.status === filter
  );

  return (
    <div className="tata-tasks-container">
      <header className="tata-tasks-header">
        <h2>Tasks Management</h2>
        <div className="tata-filter-buttons">
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={filter === status ? "tata-active" : ""}
            >
              {status}
            </button>
          ))}
        </div>
      </header>

      <section className="tata-task-input-container">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task Title"
        />
        <input
          type="text"
          value={newTask.assignee}
          onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
          placeholder="Assignee"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className="tata-task-priority-select"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
      </section>

      <button onClick={handleSuggestion} className="tata-ai-suggestion-btn">
        Get AI Suggestions
      </button>
      {suggestion && (
        <div className="tata-ai-suggestion">
          <SafeMarkdown content={suggestion} />
        </div>
      )}

      <ul className="tata-task-list">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`tata-task-item ${task.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            <div className="tata-task-content">
              <div className="tata-task-header">
                <span className="tata-task-title">{task.title}</span>
                <span
                  className={`tata-priority ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="tata-task-meta">
                <span className="tata-assignee">
                  Assigned to: {task.assignee}
                </span>
                <span className="tata-deadline">Deadline: {task.deadline}</span>
              </div>
            </div>
            <div className="tata-task-status">
              <select
                value={task.status}
                onChange={(e) => changeStatus(task.id, e.target.value)}
                className="tata-task-status-select"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                onClick={() => handleSummarize(task)}
                className="tata-ai-summary-btn"
                disabled={isLoading[task.id]}
              >
                {isLoading[task.id] ? "Generating..." : "Summarize"}
              </button>
              {taskSummaries[task.id] && (
                <div className="tata-task-summary">
                  <SafeMarkdown content={taskSummaries[task.id]} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
