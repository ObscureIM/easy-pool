#### Basic features

* TCP (stratum-like) protocol for server-push based jobs
  * Compared to old HTTP protocol, this has a higher hash rate, lower network/CPU server load, lower orphan
    block percent, and less error prone
* IP banning to prevent low-diff share attacks
* Socket flooding detection
* Payment processing
  * Splintered transactions to deal with max transaction size
  * Minimum payment threshold before balance will be paid out
  * Minimum denomination for truncating payment amount precision to reduce size/complexity of block transactions
* Detailed logging
* Ability to configure multiple ports - each with their own difficulty
* Variable difficulty / share limiter
* Share trust algorithm to reduce share validation hashing CPU load
* Clustering for vertical scaling
* Modular components for horizontal scaling (pool server, database, stats/API, payment processing, front-end)
* Live stats API (using AJAX long polling with CORS)
  * Currency network/block difficulty
  * Current block height
  * Network hashrate
  * Pool hashrate
  * Each miners' individual stats (hashrate, shares submitted, pending balance, total paid, etc)
  * Blocks found (pending, confirmed, and orphaned)
* An easily extendable, responsive, light-weight front-end using API to display data

#### Extra features

* Admin panel
  * Aggregated pool statistics
  * Coin daemon & wallet RPC services stability monitoring
  * Log files data access
  * Users list with detailed statistics
* Historic charts of pool's hashrate and miners count, coin difficulty, rates and coin profitability
* Historic charts of users's hashrate and payments
* Miner login(wallet address) validation
* Five configurable CSS themes
* Universal blocks and transactions explorer based on [chainradar.com](http://chainradar.com)
* FantomCoin & MonetaVerde support
* Set fixed difficulty on miner client by passing "address" param with ".[difficulty]" postfix
* Prevent "transaction is too big" error with "payments.maxTransactionAmount" option


#### Pools Using This Software

* http://pool.obscure.im/


Usage
===

#### Requirements
* Obscured daemon
* obscure-service
* [Node.js](http://nodejs.org/) LTS (6,8,10) ([follow these installation instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions))
* [Redis](http://redis.io/) key-value store v2.6+ ([follow these instructions](http://redis.io/topics/quickstart))
* libssl required for the node-multi-hashing module
  * For Ubuntu: `sudo apt-get install -y libssl-dev`

##### Windows Support

You will need the windows build tools to install this module (and many more) on windows. Run the following command to set up your environment.

```bash
npm install -g windows-build-tools --vs2015
```

##### Seriously
Those are legitimate requirements. If you use old versions of Node.js or Redis that may come with your system package manager then you will have problems. Follow the linked instructions to get the last stable versions.

[**Redis security warning**](http://redis.io/topics/security): be sure firewall access to redis - an easy way is to
include `bind 127.0.0.1` in your `redis.conf` file. Also it's a good idea to learn about and understand software that
you are using - a good place to start with redis is [data persistence](http://redis.io/topics/persistence).

##### Easy install on Ubuntu 14 LTS

Installing pool on different Linux distributives is different because it depends on system default components and versions. For now the easiest way to install pool is to use Ubuntu 14 LTS. Thus, all you had to do in order to prepare Ubuntu 14 for pool installation is to run:

```bash
sudo apt-get install -y git build-essential redis-server libboost1.55-all-dev cmake libssl-dev node-gyp
```

##### Debian 9 installation
These are the steps taken to install pool on Debian 9.  These steps will also work on Ubuntu 16 & 18:

```bash
sudo apt-get install -y git curl wget screen build-essential redis-server libboost-all-dev cmake libssl-dev node-gyp
```
I have currently tested this on Node 8.11.1 and 8.12.0.

You can install node here: (https://nodejs.org/en/download/package-manager/)

Or directly from a terminal:

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

I have found using a screen session to keep everything running on the server works well.

#### Now lets start

First clone this repo

```
git clone https://github.com/ObscureIM/easy-pool.git
cd easy-pool
```

Next we want to copy our Obscured daemon and obscure-service into the respective folder
```
cp /path/to/Obscured ./Obscured-ha
cp /path/to/obscure-service ./walletd-ha
npm install

//Starts the high availability daemon
forever start ./Obscured-ha/service.js

//create a wallet container called container.walletd with password "password"
./walletd-ha/obscure-service -w container.walletd -p password -g

//starts the high availability wallet
forever start ./walletd-ha/service.js

//starts the mining pool backend
forever start ./node-obscure-pool/init.js

//starts the mining pool front-end for ur workers
forever start ./node-obscure-pool/server.js


// DONE!
```

If you would like to configure the mining node configurations :

```
nano ./node-obscure-pool/config.json

```

Below is the commented code:

#### 2) Configuration


Explanation for each field:
```javascript
/* Used for storage in redis so multiple coins can share the same redis instance. */
"coin": "dashcoin",

/* Used for front-end display */
"symbol": "DSH",

/* Minimum units in a single coin, see COIN constant in DAEMON_CODE/src/cryptonote_config.h */
"coinUnits": 1000000000000,

/* Coin network time to mine one block, see DIFFICULTY_TARGET constant in DAEMON_CODE/src/cryptonote_config.h */
"coinDifficultyTarget": 120,

"logging": {

    "files": {

        /* Specifies the level of log output verbosity. This level and anything
           more severe will be logged. Options are: info, warn, or error. */
        "level": "info",

        /* Directory where to write log files. */
        "directory": "logs",

        /* How often (in seconds) to append/flush data to the log files. */
        "flushInterval": 5
    },

    "console": {
        "level": "info",
        /* Gives console output useful colors. If you direct that output to a log file
           then disable this feature to avoid nasty characters in the file. */
        "colors": true
    }
},

/* Modular Pool Server */
"poolServer": {
    "enabled": true,

    /* Set to "auto" by default which will spawn one process/fork/worker for each CPU
       core in your system. Each of these workers will run a separate instance of your
       pool(s), and the kernel will load balance miners using these forks. Optionally,
       the 'forks' field can be a number for how many forks will be spawned. */
    "clusterForks": "auto",

    /* Address where block rewards go, and miner payments come from. */
    "poolAddress": "D6WLtrV1SBWV8HWQzQv8uuYuGy3uwZ8ah5iT5HovSqhTKMauquoTsKP8RBJzVqVesX87poYWQgkGWB4NWHJ6Ravv93v4BaE"

    /* Poll RPC daemons for new blocks every this many milliseconds. */
    "blockRefreshInterval": 1000,

    /* How many seconds until we consider a miner disconnected. */
    "minerTimeout": 900,

    "ports": [
        {
            "port": 3333, //Port for mining apps to connect to
            "difficulty": 100, //Initial difficulty miners are set to
            "desc": "Low end hardware" //Description of port
        },
        {
            "port": 5555,
            "difficulty": 2000,
            "desc": "Mid range hardware"
        },
        {
            "port": 7777,
            "difficulty": 10000,
            "desc": "High end hardware"
        }
    ],

    /* Variable difficulty is a feature that will automatically adjust difficulty for
       individual miners based on their hashrate in order to lower networking and CPU
       overhead. */
    "varDiff": {
        "minDiff": 2, //Minimum difficulty
        "maxDiff": 100000,
        "targetTime": 100, //Try to get 1 share per this many seconds
        "retargetTime": 30, //Check to see if we should retarget every this many seconds
        "variancePercent": 30, //Allow time to very this % from target without retargeting
        "maxJump": 100 //Limit diff percent increase/decrease in a single retargeting
    },

    /* Set difficulty on miner client side by passing <address> param with .<difficulty> postfix
       minerd -u D3z2DDWygoZU4NniCNa4oMjjKi45dC2KHUWUyD1RZ1pfgnRgcHdfLVQgh5gmRv4jwEjCX5LoLERAf5PbjLS43Rkd8vFUM1m.5000 */
    "fixedDiff": {
        "enabled": true,
        "separator": ".", // character separator between <address> and <difficulty>
    },

    /* Feature to trust share difficulties from miners which can
       significantly reduce CPU load. */
    "shareTrust": {
      "enabled": false, //enable or disable the shareTrust system. shareTrust can offer significant CPU workload reduction, however does present a risk of being exploited by miners gaming the percentages of the system.
      "maxTrustPercent": 50, //The maximum percent chance a share will be considered trusted (not fully validated) 50 means 1 of 2 shares are fully validated at random, 75 means 1 of 4 are fully validated (or 3 of 4 are trusted).
      "probabilityStepPercent": 1, //The percent the probabality of a share is trusted increases from 0 to maxTrustPercent at a maximum rate of once per probabilityStepWindow seconds in steps of probabilityStepPercent and only on share submission.
      "probabilityStepWindow": 30, //The probability (chance a share is considered trusted) will increase from 0 to maxTrustPercent by steps of probabilityStepPercent at a maximum rate of once every probabilityStepWindow seconds.
      "minUntrustedShares": 50, //The minimum amount of shares that will be fully validated before shareTrust will begin.
      "minUntrustedSeconds": 300, //The minimum amount of time in seconds shares will be fully validated before shareTrust will begin.
      "maxTrustedDifficulty": 100000, //Shares above this difficulty will be fully validated (not trusted).
      "maxPenaltyMultiplier": 100, //The maximum penalty multiplied against minUntrustedShares and minUntrustedSeconds.
      "minPenaltyMultiplier": 2, //The minimum penalty multiplied against minUntrustedShares and minUntrustedSeconds.
      "penaltyMultiplierStep": 1, //The penalty is multiplied against minUntrustedShares and minUntrustedSeconds. The penalty Steps up/down penaltyMultiplierStep a maximum of once per every penaltyStepUpWindow or penaltyStepDownWindow and only on share submission.
      "penaltyStepUpWindow": 30, //The penalty steps up a maximum of penaltyMultiplierStep every penaltyStepUpWindow seconds and only on share submission.
      "penaltyStepDownWindow": 120, //The penalty steps down a maximum of penaltyMultiplierStep every penaltyStepDownWindow seconds and only on share submission.
      "maxShareWindow": 300, //Must Submit within this window or minUntrustedSeconds, minUntrustedShares and Probability are reset.
      "maxIPCRate": 15, //The minimum amount of seconds between sharing a miners shareTrust data between pool threads.
      "maxAge": 604800 //Maximum seconds to retain dissconnected miner shareTrust data in memory.
    },

    /* If under low-diff share attack we can ban their IP to reduce system/network load. */
    "banning": {
        "enabled": true,
        "time": 600, //How many seconds to ban worker for
        "invalidPercent": 25, //What percent of invalid shares triggers ban
        "checkThreshold": 30 //Perform check when this many shares have been submitted
    },
    /* Slush Mining is a reward calculation technique which disincentivizes pool hopping and rewards users to mine with the pool steadily: Values of each share decrease in time – younger shares are valued higher than older shares.
    More about it here: https://mining.bitcoin.cz/help/#!/manual/rewards */
    /* There is some bugs with enabled slushMining. Use with '"enabled": false' only. */

    "slushMining": {
        "enabled": false, // 'true' enables slush mining. Recommended for pools catering to professional miners
        "weight": 120, //defines how fast value assigned to a share declines in time
        "lastBlockCheckRate": 1 //How often the pool checks for the timestamp of the last block. Lower numbers increase load for the Redis db, but make the share value more precise.
    }
},

/* Module that sends payments to miners according to their submitted shares. */
"payments": {
    "enabled": true,
    "interval": 600, //how often to run in seconds
    "maxAddresses": 50, //split up payments if sending to more than this many addresses
    "transferFee": 5000000000, //fee to pay for each transaction
    "minPayment": 100000000000, //miner balance required before sending payment
    "maxTransactionAmount": 0, //split transactions by this amount(to prevent "too big transaction" error)
    "denomination": 100000000000 //truncate to this precision and store remainder
},

/* Module that monitors the submitted block maturities and manages rounds. Confirmed
   blocks mark the end of a round where workers' balances are increased in proportion
   to their shares. */
"blockUnlocker": {
    "enabled": true,
    "interval": 30, //how often to check block statuses in seconds

    /* Block depth required for a block to unlocked/mature. Found in daemon source as
       the variable CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW */
    "depth": 60,
    "poolFee": 1.8, //1.8% pool fee (2% total fee total including donations)
    "devDonation": 0.1, //0.1% donation to send to pool dev - only works with Monero
    "coreDevDonation": 0.1 //0.1% donation to send to core devs - works with Bytecoin, Monero, Dashcoin, QuarazCoin, Fantoncoin, AEON and OneEvilCoin
},

/* AJAX API used for front-end website. */
"api": {
    "enabled": true,
    "hashrateWindow": 600, //how many second worth of shares used to estimate hash rate
    "updateInterval": 3, //gather stats and broadcast every this many seconds
    "host": "127.0.0.1", //if api module is running on a different host (i.e, containerized),
    "port": 8117,
    "blocks": 30, //amount of blocks to send at a time
    "payments": 30, //amount of payments to send at a time
    "password": "test" //password required for admin stats
},

/* Coin daemon connection details. */
"daemon": {
    "host": "127.0.0.1",
    "port": 29081
},

/* Wallet daemon connection details. */
"wallet": {
    "host": "127.0.0.1",
    "port": 29082,
    "password": "<replace with rpc password>"
},

/* Redis connection into. */
"redis": {
    "host": "127.0.0.1",
    "port": 6379
}

/* Monitoring RPC services. Statistics will be displayed in Admin panel */
"monitoring": {
    "daemon": {
        "checkInterval": 60, //interval of sending rpcMethod request
        "rpcMethod": "getblockcount" //RPC method name
    },
    "wallet": {
        "checkInterval": 60,
        "rpcMethod": "get_address_count"
    }

/* Collect pool statistics to display in frontend charts  */
"charts": {
    "pool": {
        "hashrate": {
            "enabled": true, //enable data collection and chart displaying in frontend
            "updateInterval": 60, //how often to get current value
            "stepInterval": 1800, //chart step interval calculated as average of all updated values
            "maximumPeriod": 86400 //chart maximum periods (chart points number = maximumPeriod / stepInterval = 48)
        },
        "workers": {
            "enabled": true,
            "updateInterval": 60,
            "stepInterval": 1800, //chart step interval calculated as maximum of all updated values
            "maximumPeriod": 86400
        },
        "difficulty": {
            "enabled": true,
            "updateInterval": 1800,
            "stepInterval": 10800,
            "maximumPeriod": 604800
        },
        "price": { //USD price of one currency coin received from cryptonator.com/api
            "enabled": true,
            "updateInterval": 1800,
            "stepInterval": 10800,
            "maximumPeriod": 604800
        },
        "profit": { //Reward * Rate / Difficulty
            "enabled": true,
            "updateInterval": 1800,
            "stepInterval": 10800,
            "maximumPeriod": 604800
        }
    },
    "user": { //chart data displayed in user stats block
        "hashrate": {
            "enabled": true,
            "updateInterval": 180,
            "stepInterval": 1800,
            "maximumPeriod": 86400
        },
        "payments": { //payment chart uses all user payments data stored in DB
            "enabled": true
        }
    }
```
