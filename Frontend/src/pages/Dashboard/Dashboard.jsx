import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  const projectProgress = [
    { name: "Planning", completed: 100, remaining: 0 },
    { name: "Design", completed: 80, remaining: 20 },
    { name: "Development", completed: 60, remaining: 40 },
    { name: "Testing", completed: 30, remaining: 70 },
    { name: "Deployment", completed: 10, remaining: 90 },
  ];

  const teamPerformance = [
    { name: "Team A", value: 30 },
    { name: "Team B", value: 25 },
    { name: "Team C", value: 20 },
    { name: "Team D", value: 15 },
    { name: "Team E", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <header className="dashboard-header">
        <div className="header-content">
          <h1>SyncOps Dashboard</h1>
          <p>Team Collaboration Hub</p>
        </div>
        <div className="header-actions">
          {/* <button className="action-button">Create Task</button> */}
          {/* <button className="action-button">Schedule Meeting</button> */}
          {/* <button className="theme-switcher" onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button> */}
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="widget tasks">
          <h3>Active Tasks</h3>
          <p className="widget-value">127</p>
          <span className="widget-change positive">+12 this week</span>
        </div>
        <div className="widget members">
          <h3>Team Members</h3>
          <p className="widget-value">48</p>
          <span className="widget-change">+3 new hires</span>
        </div>
        <div className="widget deadlines">
          <h3>Upcoming Deadlines</h3>
          <p className="widget-value">5</p>
          <span className="widget-change negative">2 overdue</span>
        </div>
        <div className="widget efficiency">
          <h3>Team Efficiency</h3>
          <p className="widget-value">92%</p>
          <span className="widget-change positive">+5% this month</span>
        </div>
        <div className="widget project-progress">
          <h3>Project Completion</h3>
          <p className="widget-value">75%</p>
          <span className="widget-change positive">+10% this month</span>
        </div>
        <div className="widget feedback">
          <h3>Client Feedback</h3>
          <p className="widget-value">4.7/5</p>
          <span className="widget-change positive">+0.2 this week</span>
        </div>
      </div>

      <div className="chart-container">
        <h2>Project Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectProgress} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(tick) => `${tick * 100}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="completed" stackId="a" fill="#34A853" />
            <Bar dataKey="remaining" stackId="a" fill="#FFC107" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Team Performance Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={teamPerformance}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {teamPerformance.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="recent-activity">
        <h2>Recent Team Activity</h2>
        <ul>
          <li>
            <span className="activity-time">10:45 AM</span>
            <span className="activity-user">Rajesh Sharma</span>
            <span className="activity-action">completed task</span>
            <span className="activity-item">
              "Implement user authentication"
            </span>
          </li>
          <li>
            <span className="activity-time">09:30 AM</span>
            <span className="activity-user">Priya Patel</span>
            <span className="activity-action">created project</span>
            <span className="activity-item">"E-commerce Platform"</span>
          </li>
          <li>
            <span className="activity-time">Yesterday</span>
            <span className="activity-user">Amit Kumar</span>
            <span className="activity-action">reached milestone</span>
            <span className="activity-item">
              "Backend Microservices Architecture"
            </span>
          </li>
          <li>
            <span className="activity-time">2 days ago</span>
            <span className="activity-user">Anjali Reddy</span>
            <span className="activity-action">scheduled meeting</span>
            <span className="activity-item">"Quarterly Innovation Review"</span>
          </li>
          <li>
            <span className="activity-time">3 days ago</span>
            <span className="activity-user">Vikram Singh</span>
            <span className="activity-action">reviewed code</span>
            <span className="activity-item">"Payment Gateway Integration"</span>
          </li>
          <li>
            <span className="activity-time">Last week</span>
            <span className="activity-user">Neha Mehta</span>
            <span className="activity-action">deployed release</span>
            <span className="activity-item">"Customer Feedback Module"</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
