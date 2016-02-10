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

    let loadOrmStub, createOrmStub, db, loadOrmFileStub;

    beforeEach(() => {

        loadOrmStub = sinon.stub(Db.prototype, "loadOrm", () => {});
        createOrmStub = sinon.stub(Db.prototype, "createOrm", () => {});
        loadOrmFileStub = sinon.stub(Db.prototype, "loadOrmFile", () => {});

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
            },
            ormConfig: {
                ormName: "waterline"
            }
        });

    });

    afterEach(() => {

        loadOrmStub.restore();
        createOrmStub.restore();
        loadOrmFileStub.restore();

    });

    it("Should call load ORM", () => {

        assert.isTrue(loadOrmStub.calledOnce, "Load ORM method should be called");

    });

    it("Should call load ORM", () => {

        assert.isTrue(createOrmStub.calledOnce, "Create ORM method should be called");

    });

    it("Should not call load ORM", () => {

        loadOrmStub.reset();

        new Db({
            enabled: false,
            adapterConfig: {
                adapterName: "teo.db.adapter.waterline"
            },
            ormConfig: {
                ormName: "waterline"
            }
        });

        assert.isFalse(loadOrmStub.calledOnce, "Load ORM method should not be called");

    });

    it("Should not call load ORM", () => {

        createOrmStub.reset();

        new Db({
            enabled: false,
            adapterConfig: {
                adapterName: "teo.db.adapter.waterline"
            },
            ormConfig: {
                ormName: "waterline"
            }
        });

        assert.isFalse(createOrmStub.calledOnce, "Create ORM method should not be called");

    });

    it("Should parse config correctly", () => {

        assert.equal(db.config.ormConfig.ormPath, path.join(db.homeDir, "orm"), "Default ORM path should be set to the 'homeDir/orm'");
        assert.equal(db.config.ormConfig.ormPrefix, "teo.db.orm.", "Default ORM prefix should be teo.db.orm.");
        assert.equal(db.config.adapterConfig.adapterName, "teo.db.adapter.waterline", "ORM adapter name is not correct");
        assert.deepEqual(db.config.adapterConfig, {
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
        }, "ORM adapter config is not correct");

    });

    it("Should load ORM file if config.ormModule isn't set", () => {

        loadOrmStub.restore();
        let db = new Db({
            enabled: true,
            adapterConfig: {
                adapters: {

                },
                connections: {

                }
            },
            ormConfig: {
                ormPath: "./path",
                ormPrefix: "my.prefix.",
                ormName: "myName"
            }
        });

        assert.isTrue(loadOrmFileStub.calledOnce);
        assert.equal(loadOrmFileStub.args[0][0], "path/my.prefix.myname");

    });

    it("Should load ORM module if config.ormModule is set", () => {

        loadOrmStub.restore();
        let db = new Db({
            enabled: true,
            adapterConfig: {
                adapters: {

                },
                connections: {

                }
            },
            ormConfig: {
                ormModule: "my-module"
            }
        });

        assert.isTrue(loadOrmFileStub.calledOnce);
        assert.equal(loadOrmFileStub.args[0][0], "my-module");

    });

    it("Should set path based on current working directory of the process if no config.ormPath passed", () => {

        loadOrmStub.restore();
        let db = new Db({
            enabled: true,
            adapterConfig: {
                adapters: {

                },
                connections: {

                }
            },
            ormConfig: {
                ormPrefix: "my.prefix.",
                ormName: "myName"
            }
        });

        assert.isTrue(loadOrmFileStub.calledOnce);
        assert.equal(loadOrmFileStub.args[0][0], path.join(db.homeDir, "orm", "my.prefix.myname"));

    });

    it("Should create new orm instance", () => {

        createOrmStub.restore();

        db.Orm = function orm() {};

        let instance = db.createOrm();

        assert.instanceOf(instance, db.Orm);
        assert.instanceOf(db.instance, db.Orm);

    });

    it("Shouldn't load and create orm if config.enabled is false", () => {

        loadOrmStub.reset();
        createOrmStub.reset();

        let db = new Db({
            adapterConfig: {
                adapters: {

                },
                connections: {

                }
            },
            ormConfig: {
                ormPrefix: "my.prefix.",
                ormName: "myName"
            }
        });

        assert.isFalse(loadOrmStub.called);
        assert.isFalse(createOrmStub.called);

    });

});