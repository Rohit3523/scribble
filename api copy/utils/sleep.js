function sleep(ms, resolver){
    new Promise((resolve) => setTimeout(resolver ?? resolve, ms))
}

module.exports = sleep;