import { exec } from 'child_process'
import { promisify } from 'util'
import ora from 'ora'
import chalk from 'chalk'

const execAsync = promisify(exec)

export async function clone(project: string, options: { user: string }) {
  const { user } = options
  const repoUrl = `https://github.com/${user}/${project}.git`
  const repoIdentifier = chalk.cyan(`${user}/${project}`)

  const spinner = ora(`Cloning repository ${repoIdentifier}...`).start()

  try {
    await execAsync(`git clone ${repoUrl}`)
    spinner.succeed(chalk.green(`Project ${chalk.bold(project)} cloned successfully.`))
  } catch (error: any) {
    spinner.fail(chalk.red(`Error occurred while cloning repository ${repoIdentifier}.`))
    console.error(chalk.gray(error.stderr || error.message))
    process.exit(1)
  }
}