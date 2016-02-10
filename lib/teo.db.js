/*!
 * Teo.JS DB driver implementation
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 2/8/16
 */

"use strict";

const
    Base = require("teo-base"),
    path = require("path");

module.exports = class TeoDB extends Base {
    constructor(config) {
        super(config);
        // if usage of db is enabled
        if (this.config.enabled === true) {
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
        this.config = {enabled: config.enabled, adapterConfig: {}, ormConfig: {}};

        let adapterDefaultConfig = {
            adapterName: config.adapterConfig.adapterName,
            // adapters
            adapters: Object.assign({}, config.adapterConfig.adapters),
            // Connections Config
            // Setup connections using the named adapter configs
            connections: Object.assign({}, config.adapterConfig.connections)
        };
        let ormDefaultConfig = {
            ormPath: config.ormConfig.ormPath || path.join(this.homeDir, "orm"),          // ormPath: "./orm",
            ormPrefix: config.ormConfig.ormPrefix || "teo.db.orm.",                       // ormPrefix: "teo.db.orm."
            ormName: config.ormConfig.ormName || "default",
            ormModule: config.ormConfig.ormModule
        };

        Object.assign(this.config.adapterConfig, config.adapterConfig, adapterDefaultConfig);
        Object.assign(this.config.ormConfig, config.ormConfig, ormDefaultConfig);
    }

    /**
     * Loads ORM
     */
    loadOrm() {
        if (this.ormConfig.ormModule) {
            this.loadOrmFile(this.ormConfig.ormModule);
        }
        else {
            this.loadOrmFile(path.join(this.ormConfig.ormPath, `${this.ormConfig.ormPrefix.toLowerCase()}${this.ormConfig.ormName.toLowerCase()}`));
        }
    }

    /**
     * Loads ORM module
     * @param {String} ormPath
     */
    loadOrmFile(ormPath) {
        this.Orm = this._load(ormPath);
    }

    /**
     * Loads file or module
     * @param {String} path
     * @private
     */
    _load(path) {
        let module;
        try {
            module = require(path);
        } catch(e) {
            console.error(e);
            throw e;
        }
        return module;
    }

    /**
     * Creates ORM instance
     */
    createOrm() {
        this.ormInstance = new this.Orm({
            ormConfig: this.ormConfig,
            adapterConfig: this.adapterConfig
        });

        return this.ormInstance;
    }

    /**
     * Getter of ORM instance
     * @returns {*}
     */
    getOrmInstance() {
        return this.ormInstance;
    }

    /**
     * Connects db
     */
    * connect() {
        yield* this.getOrmInstance().connect();
    }

    /**
     * Disconnect db
     */
    * disconnect() {
        yield* this.getOrmInstance().disconnect();
    }

    /**
     * Check if DB is connected
     * @returns {Boolean}
     */
    isConnected() {
        return this.getOrmInstance().isConnected();
    }

    get homeDir() {
        return process.cwd().replace(/\\/g, "/");
    }

    get instance() {
        return this.ormInstance;
    }

    get ormConfig() {
        return this.config.ormConfig;
    }

    get adapterConfig() {
        return this.config.adapterConfig;
    }
};