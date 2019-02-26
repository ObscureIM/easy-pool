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
