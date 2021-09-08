import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

export default () => {
  return yaml.load(
    readFileSync(process.env.CONFIG_PATH.toString(), 'utf8'),
  ) as Record<string, any>;
};