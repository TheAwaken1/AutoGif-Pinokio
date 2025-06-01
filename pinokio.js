const path = require('path');
module.exports = {
  version: "2.0",
  title: "🎬 AutoGif",
  description: "Transform YouTube videos into stunning animated GIFs with perfectly-timed, stylized subtitles and eye-catching effects.",
  icon: "icon.png",
  menu: async (kernel, info) => {
    let installed = info.exists("app/env");
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js")
    };

    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-download",
        text: "Installing...",
        href: "install.js"
      }];
    } else if (installed) {
      if (running.start) {
        let local = info.local("start.js");
        if (local && local.url) {
          return [{
            default: true,
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: local.url
          }, {
            icon: "fa-solid fa-terminal",
            text: "Terminal",
            href: "start.js"
          }];
        } else {
          return [{
            default: true,
            icon: "fa-solid fa-terminal",
            text: "Starting...",
            href: "start.js"
          }];
        }
      } else if (running.update) {
        return [{
          default: true,
          icon: "fa-solid fa-sync",
          text: "Updating...",
          href: "update.js"
        }];
      } else if (running.reset) {
        return [{
          default: true,
          icon: "fa-solid fa-undo",
          text: "Resetting...",
          href: "reset.js"
        }];
      } else {
        return [{
          icon: "fa-solid fa-play",
          text: "Start",
          href: "start.js"
        }, {
          icon: "fa-solid fa-folder-open",
          text: "View Output",
          href: "app/output",
          fs: true
        }, {
          icon: "fa-solid fa-sync",
          text: "Update",
          href: "update.js"
        }, {
          icon: "fa-solid fa-download",
          text: "Reinstall",
          href: "install.js"
        }, {
          icon: "fa-solid fa-trash",
          text: "Reset",
          href: "reset.js"
        }];
      }
    } else {
      return [{
        default: true,
        icon: "fa-solid fa-download",
        text: "Install",
        href: "install.js"
      }];
    }
  }
}
