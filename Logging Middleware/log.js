async function Log(stack, level, pkg, message) {
  const validStacks = ["backend", "frontend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = {
    backend: ["cache", "controller", "cron_job", "db", "auth", "config", "middleware", "utils"],
    frontend: ["api", "component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils"]
  };

  if (!validStacks.includes(stack)) throw new Error("Invalid stack");
  if (!validLevels.includes(level)) throw new Error("Invalid level");
  if (!validPackages[stack].includes(pkg)) throw new Error("Invalid package for given stack");

  const body = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Log response:", data);
    return data;
  } catch (err) {
    console.error("Failed to log:", err);
  }
}
