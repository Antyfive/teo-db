/*!
 * 
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 2/8/16
 */

"use strict";

const
    Base = require("teo-base");

module.exports = class TeoDB extends Base {
    constructor(config) {
        super(config);
        // if usage of db is enabled
        if (this.enabled) {
            try {
                this.loadOrm();
                this.createOrm();
            } catch(e) {
                console.error(e);
                throw e;
            }
        }
    }

    applyConfig(config) {
        let config = {
            enabled: config.enabled,
            ormName: config.ormName,
            // teo.js orm adapter
            adapterName: config.adapterName,
            // parse adapter config
            adapterConfig: {
                // adapters
                adapters: Object.assign({}, config.adapterConfig.adapters),
                // Connections Config
                // Setup connections using the named adapter configs
                connections: Object.assign({}, config.adapterConfig.connections)
            }
        };

        Object.assign(this, {
            ormPath: "./orm",
            ormPrefix: "teo.db.orm."
        }, config);
    }

    /**
     * Loads ORM
     */
    loadOrm() {
        // TODO: all ORMs should be moved to separate packages after plugin system will be implemented
        this[this.ormName] = require(this.ormPath + "/" + this.ormPrefix + this.ormName.toLowerCase());
    }

    /**
     * Creates ORM instance
     */
    createOrm() {
        this.orm = new this[this.ormName]({
            ormName: this.ormName,
            adapterName: this.adapterName,
            adapterConfig: this.adapterConfig
        });
    }

    /**
     * Getter of ORM instance
     * @returns {*}
     */
    getOrm() {
        return this.orm;
    }

    /**
     * Connects db
     */
    * connect() {
        yield* this.getOrm().connect();
    }

    /**
     * Disconnect db
     */
    * disconnect() {
        yield* this.getOrm().disconnect();
    }

    connected() {
        return this.getOrm().connected();
    }
};