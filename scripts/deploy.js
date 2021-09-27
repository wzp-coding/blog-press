const { exec } = require("child_process");
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const moment = require('moment')
moment.locale('zh-cn')
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })
const step = msg => console.log(chalk.cyan(msg))
const bin = (name) => path.resolve(__dirname, '../node_modules/.bin/' + name)
const execPath = path.resolve(__dirname, '../docs/.vuepress/dist')
const opts = { execPath, cwd: execPath, preferLocal: true }

const github = "https://github.com/wzp-coding/wzp-coding.github.com.git";
async function deploy() {
  step('\n\"vuepress build docs\" starting...')
  await run(bin('vuepress'), ['build', 'docs'])

  step('\ninit repository starting')

  step('\n\"git init\" running')
  await run('git', ['init'], opts)

  step('\n\"git add .\" running')
  await run('git', ['add', '.'], opts)

  const commitInfo = moment().format('LLLL');
  step(`\n\"git commit -m \'${commitInfo}\' \" running`)
  await run('git', ['commit', '-m', commitInfo], opts)

  step(`\n\"git remote add origin ${github}\"`)
  await run('git', ['remote', 'add', 'origin', github], opts)

  step(`\n\"git push --set-upstream origin master -f\"`)
  await run('git', ['push', '--set-upstream', 'origin', 'master', '-f'], opts)

  step(`\n\"git push --set-upstream origin master -f\"`)
  console.log(chalk.green(commitInfo + '部署成功'))
}
deploy().catch(err => console.error(err))

