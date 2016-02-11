/*!
 * teo.db spec
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 2/8/16
 */

"use strict";

/* global define, describe, beforeEach, afterEach, it, assert, sinon, teoBase  */

"use strict";

const Db = require("../../lib/teo.db"),
    path = require("path");

describe("Testing teo.db", () => {

    let loadAdapterStub, createAdapterStub, db, loadAdapterFileStub;

    beforeEach(() => {

        loadAdapterStub = sinon.stub(Db.prototype, "loadAdapter", () => {});
        createAdapterStub = sinon.stub(Db.prototype, "createAdapter", () => {});
        loadAdapterFileStub = sinon.stub(Db.prototype, "loadAdapterFile", () => {});

        db = new Db({
            enabled: true,
            adapterConfig: {
                adapterName: "teo.db.adapter.waterline",
                adapters: {
                    "default": "sails-disk",
                    disk: "sails-disk",
                    mysql: "sails-mysql"
                },
                connections: {
                    myLocalDisk: {
                        adapter: "disk"
                    },
                    myLocalMySql: {
                        adapter: "mysql",
                        host: "localhost",
                        database: "foobar"
                    }
                }
            }
        });

    });

    afterEach(() => {

        loadAdapterStub.restore();
        createAdapterStub.restore();
        loadAdapterFileStub.restore();

    });

    it("Should call load Adapter", () => {

        assert.isTrue(loadAdapterStub.calledOnce, "Load Adapter method should be called");

    });

    it("Should call create Adapter", () => {

        assert.isTrue(createAdapterStub.calledOnce, "Create Adapter method should be called");

    });

    it("Should call load Adapter", () => {

        loadAdapterStub.reset();

        new Db({
            enabled: false,
            adapterConfig: {
                adapterName: "waterline"
            }
        });

        assert.isFalse(loadAdapterStub.calledOnce, "Load Adapter method should not be called");

    });

    it("Should call create Adapter", () => {

        createAdapterStub.reset();

        new Db({
            enabled: false,
            adapterConfig: {
                adapterName: "teo.db.adapter.waterline"
            }
        });

        assert.isFalse(createAdapterStub.calledOnce, "Create Adapter method should not be called");

    });

    it("Should parse config correctly", () => {

        assert.equal(db.config.adapterConfig.adapterPath, path.join(db.homeDir, "adapters"), "Default Adapter path should be set to the 'homeDir/adapters'");
        assert.equal(db.config.adapterConfig.adapterPrefix, "teo.db.adapter.", "Default Adapter prefix should be teo.db.adapter.");
        assert.equal(db.config.adapterConfig.adapterName, "teo.db.adapter.waterline", "Adapter adapter name is not correct");
        assert.deepEqual(db.config.adapterConfig, {
            adapterName: "teo.db.adapter.waterline",
            adapterModule: undefined,
            adapterPath: "/Users/teologov/Sites/personal/github/teo-db/adapters",
            adapterPrefix: "teo.db.adapter.",
            adapters: {
                "default": "sails-disk",
                disk: "sails-disk",
                mysql: "sails-mysql"
            },
            connections: {
                myLocalDisk: {
                    adapter: "disk"
                },
                myLocalMySql: {
                    adapter: "mysql",
                    host: "localhost",
                    database: "foobar"
                }
            }
        }, "Adapter adapter config is not correct");

    });

    it("Should load Adapter file if config.adapterModule isn't set", () => {

        loadAdapterStub.restore();
        let db = new Db({
            enabled: true,
            adapterConfig: {
                adapters: {

                },
                connections: {

                },
                adapterPath: "./path",
                adapterPrefix: "my.prefix.",
                adapterName: "myName"
            },
        });

        assert.isTrue(loadAdapterFileStub.calledOnce);
        assert.equal(loadAdapterFileStub.args[0][0], "path/my.prefix.myname");

    });

    it("Should load Adapter module if config.adapterModule is set", () => {

        loadAdapterStub.restore();
        let db = new Db({
            enabled: true,
            adapterConfig: {
                adapters: {

                },
                connections: {

                },
                adapterModule: "my-module"
            }
        });

        assert.isTrue(loadAdapterFileStub.calledOnce);
        assert.equal(loadAdapterFileStub.args[0][0], "my-module");

    });

    it("Should set path based on current working directory of the process if no config.adapterPath passed", () => {

        loadAdapterStub.restore();
        let db = new Db({
            enabled: true,
            adapterConfig: {
                adapters: {

                },
                connections: {

                },
                adapterPrefix: "my.prefix.",
                adapterName: "myName"
            }
        });

        assert.isTrue(loadAdapterFileStub.calledOnce);
        assert.equal(loadAdapterFileStub.args[0][0], path.join(db.homeDir, "adapters", "my.prefix.myname"));

    });

    it("Should create new adapter instance", () => {

        createAdapterStub.restore();

        db.Adapter = function adapter() {};

        let instance = db.createAdapter();

        assert.instanceOf(instance, db.Adapter);
        assert.instanceOf(db.instance, db.Adapter);

    });

    it("Shouldn't load and create adapter if config.enabled is false", () => {

        loadAdapterStub.reset();
        createAdapterStub.reset();

        let db = new Db({
            adapterConfig: {
                adapters: {

                },
                connections: {

                },
                adapterPrefix: "my.prefix.",
                adapterName: "myName"
            }
        });

        assert.isFalse(loadAdapterStub.called);
        assert.isFalse(createAdapterStub.called);

    });

});