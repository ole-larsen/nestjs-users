import {WinstonModule} from "nest-winston";
import {format, transports} from "winston";
import {utilities as nestWinstonModuleUtilities} from "nest-winston/dist/winston.utilities";

export default WinstonModule.createLogger({
  transports: [
    // let's log errors into its own file
    new transports.File({
      filename: `logs/error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // logging all level
    new transports.File({
      filename: `logs/combined.log`,
      format: format.combine(format.timestamp(), format.json()),
    }),
    // we also want to see logs in our console
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.json(),
        format.timestamp(),
        format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Sheira', {
          colors: true,
          prettyPrint: true,

        }),
      ),
    }),
  ],
});