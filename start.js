module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -m autogif.main",
        on: [{
          // Gradio typically outputs a URL like http://127.0.0.1:7860
          "event": "/http:\/\/[0-9.:]+/",
          "done": true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
      }
    },
    {
      method: "notify",
      params: {
        html: "AutoGif is running! Click 'Open Web UI' to access the interface."
      }
    }
  ]
}

