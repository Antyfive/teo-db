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
                this.loadAdapter();
                this.createAdapter();
            } catch(e) {
                console.error(e);
                throw e;
            }
        }
    }

    applyConfig(config) {
        this.config = {enabled: config.enabled, adapterConfig: {}};

        let adapterDefaultConfig = {
            adapterPath: config.adapterConfig.adapterPath || path.join(this.homeDir, "adapters"),
            adapterPrefix: config.adapterConfig.adapterPrefix || "teo.db.adapter.",
            adapterName: config.adapterConfig.adapterName || "default",
            adapterModule: config.adapterConfig.adapterModule,
            // adapters
            //adapters: Object.assign({}, config.adapterConfig.adapters),
            // Connections Config
            // Setup connections using the named adapter configs
            connections: Object.assign({}, config.adapterConfig.connections)
        };

        Object.assign(this.config.adapterConfig, config.adapterConfig, adapterDefaultConfig);
    }

    /**
     * Loads ORM
     */
    loadAdapter() {
        if (this.adapterConfig.adapterModule) {
            this.loadAdapterFile(this.adapterConfig.adapterModule);
        }
        else {
            this.loadAdapterFile(path.join(this.adapterConfig.adapterPath, `${this.adapterConfig.adapterPrefix.toLowerCase()}${this.adapterConfig.adapterName.toLowerCase()}`));
        }
    }

    /**
     * Loads ORM module
     * @param {String} adapterPath
     */
    loadAdapterFile(adapterPath) {
        this.Adapter = this._load(adapterPath);
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
    createAdapter() {
        this.adapterInstance = new this.Adapter(this.adapterConfig);   // pass all adapter config
        return this.adapterInstance;
    }

    /**
     * Connects db
     */
    * connect() {
        yield* this.instance.connect();
    }

    /**
     * Disconnect db
     */
    * disconnect() {
        yield* this.instance.disconnect();
    }

    /**
     * Check if DB is connected
     * @returns {Boolean}
     */
    isConnected() {
        return this.instance.isConnected();
    }

    get homeDir() {
        return process.cwd().replace(/\\/g, "/");
    }

    get instance() {
        return this.adapterInstance;
    }

    get adapterConfig() {
        return this.config.adapterConfig;
    }
};