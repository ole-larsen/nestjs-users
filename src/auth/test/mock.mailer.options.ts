import {ValueProvider} from "@nestjs/common";

import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import {MAILER_OPTIONS} from "@nestjs-modules/mailer";

export default function mockMailerOptionsProvider(): ValueProvider {
  const options = {
    transport: 'smtps://test@sheira.ru:testpass@smtp.sheira.ru',
    defaults: {
      from: '"welcome" <bot@sheira.ru>',
    },
    template: {
      dir: __dirname + '../../../mailer/templates',
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    }
  }
  return {
    provide: MAILER_OPTIONS,
    useValue: options,
  }
}