function formatUptime(uptime) {
	const date = new Date(uptime * 1000);
	const units = {
        year: date.getUTCFullYear() - 1970, /* Because Unix time starts in 1970, we have to get the difference*/
		month: date.getUTCMonth(),
		day: date.getUTCDate() - 1,
		hour: date.getUTCHours(),
		minute: date.getUTCMinutes(),
		second: date.getUTCSeconds(),
		millisecond: date.getUTCMilliseconds(),
    }
	return Object.entries(units)
        .map(([unit, value])=> value ? `${value} ${unit}${value > 1 ? 's': ''}` : '')
        .filter((v)=>v)
        .join(', ')
}


module.exports = function (options) {
    options = options || {};
    options.test = options.test || function () {};
    if (typeof options.test !== 'function') {
        throw new Error('express-healthcheck-test=i `test` method must be a function');
    }
    options.healthy = options.healthy || function () {
        return { uptime: formatUptime(process.uptime()) };
    };
    if (typeof options.healthy !== 'function') {
        throw new Error('express-healthcheck-improved `healthy` method must be a function');
    }
    if (options.test.length === 0) {
        var test = options.test;
        options.test = function (callback) {
            callback(test());
        };
    }
    return function (req, res, next) {
        try {
            options.test(function (err) {
                var status = 200,
                    response = options.healthy();
                if (err) {
                    status = 500;
                    response = err;
                }
                res.status(status).json(response);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    };
};
