const { exec } = require("child_process");
// exec("npm run build", (error, stdout, stderr) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   console.log(stdout);
// });
exec("cd D:\\study-file\\blog-press\\docs\\.vuepress\\dist", (err, stdout) => {
  exec("git init", (err, stdout) => {
    if (err) {
      console.log("err: ", err);
      return;
    }
    console.log("stdout: ", stdout);
    exec("git add -A", () => {
      exec("git commit -m 'deploy'", () => {
        exec(
          "git remote add origin https://github.com/wzp-coding/wzp-coding.github.com.git",
          (err, stdout, stderr) => {
            exec("git push", (err, stdout) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(stdout);
              console.log("deploy success");
            });
          }
        );
      });
    });
  });
});
