import { WebpackContext, BACKEND_TARGET } from '@malagu/cli';
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

export default (context: WebpackContext) => {
    const { configurations } = context;
    for (const c of configurations) {
        if (c.name === BACKEND_TARGET) {
            c.plugins = c.plugins || [];
            c.plugins.push(new FilterWarningsPlugin({
                exclude: [/typeorm-aurora-data-api-driver/, /mongodb/, /mssql/, /mysql/, /oracledb/, /pg/, /pg-native/, /pg-query-stream/, /sql.js/,
                    /redis/, /sqlite3/, /eact-native-sqlite-storage/, /cli-highlight/, /Critical dependency/, /@sap\/hdbext/]
            }));
        }
    }
};
