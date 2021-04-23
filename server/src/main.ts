import { ConfigService } from '@kb-config';

import { bootstrap } from './bootstrap-application';

const config = new ConfigService();

bootstrap()
  .then((app) => app.listen(config.port));
