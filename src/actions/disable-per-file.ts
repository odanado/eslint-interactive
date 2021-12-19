import chalk from 'chalk';
import { ESLint } from 'eslint';
import ora from 'ora';
import { promptToInputDescription } from '../cli/prompt.js';
import { Core } from '../core.js';

export async function doDisablePerFileAction(core: Core, results: ESLint.LintResult[], selectedRuleIds: string[]) {
  const description = await promptToInputDescription();
  const fixingSpinner = ora('Disabling...').start();
  await core.disablePerFile(results, selectedRuleIds, description);
  fixingSpinner.succeed(chalk.bold('Disabling was successful.'));
}
