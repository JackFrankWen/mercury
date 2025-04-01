/* eslint-disable */
const { execSync } = require('child_process');
const chalk = require('chalk');
const readline = require('readline');

// 定义要执行的命令和描述
const commands = [
  {
    cmd: 'npm run del-all-tables',
    desc: '删除所有表格',
  },
  { cmd: 'npm run init', desc: '初始化数据库表' },
  { cmd: 'npm run remove', desc: '删除所有数据' },
  // { cmd: 'npm run import-rules', desc: '导入基础规则' },
  { cmd: 'npm run import-a', desc: '导入高级规则' },
  // { cmd: 'npm run import-json', desc: '导入交易数据' },
  { cmd: 'npm run import-trans', desc: '导入交易数据' },
  // { cmd: 'npm run replace-name', desc: '替换交易数据' },
  // { cmd: "npm run replace", desc: "替换交易数据" },
  // 如果有更多导入脚本，可以在这里添加
];

/**
 * 执行单个命令并显示进度
 * @param {string} command 要执行的命令
 * @param {string} description 命令描述
 * @returns {Promise<boolean>} 命令是否成功执行
 */
function executeCommand(command, description) {
  return new Promise(resolve => {
    console.log(chalk.cyan(`\n[执行] ${description}`));
    console.log(chalk.gray(`> ${command}`));

    try {
      // 执行命令并实时输出结果
      execSync(command, { stdio: 'inherit' });
      console.log(chalk.green(`✓ ${description}成功完成`));
      resolve(true);
    } catch (error) {
      console.error(chalk.red(`✗ ${description}失败:`));
      console.error(chalk.red(error.message));
      resolve(false);
    }
  });
}

/**
 * 提示用户是否继续执行
 * @param {string} message 提示消息
 * @returns {Promise<boolean>} 用户是否选择继续
 */
function promptContinue(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(chalk.yellow(`${message} (y/n): `), answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * 执行所有命令的主函数
 */
async function runPipeline() {
  console.log(chalk.bold.blue('=== 数据库初始化和导入管道开始 ==='));

  // 提示用户确认是否开始
  const confirmStart = await promptContinue('这将重新初始化数据库并导入所有数据。确认继续吗?');
  if (!confirmStart) {
    console.log(chalk.yellow('操作已取消'));
    return;
  }

  let allSuccess = true;
  const startTime = Date.now();

  // 顺序执行所有命令
  for (let i = 0; i < commands.length; i++) {
    const { cmd, desc } = commands[i];
    console.log(chalk.blue(`\n[${i + 1}/${commands.length}] ${desc}`));

    const success = await executeCommand(cmd, desc);

    if (!success) {
      allSuccess = false;
      const continueAfterError = await promptContinue('上一步失败，是否继续执行后续步骤?');
      if (!continueAfterError) {
        console.log(chalk.yellow('管道执行中断'));
        break;
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(chalk.bold.blue('\n=== 数据库初始化和导入管道完成 ==='));
  console.log(chalk.blue(`总耗时: ${duration} 秒`));

  if (allSuccess) {
    console.log(chalk.green('所有步骤执行成功!'));
  } else {
    console.log(chalk.yellow('管道完成，但部分步骤失败。'));
  }
}

// 执行管道
runPipeline().catch(error => {
  console.error(chalk.red('管道执行出现未处理的错误:'));
  console.error(error);
  process.exit(1);
});
