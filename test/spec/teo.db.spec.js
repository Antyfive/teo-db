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

    let loadOrmStub, createOrmStub, db;

    beforeEach(() => {

        loadOrmStub = sinon.stub(Db.prototype, "loadOrm", () => {});
        createOrmStub = sinon.stub(Db.prototype, "createOrm", () => {});
        db = new Db({
            enabled: true,
            ormName: "waterline",
            adapterName: "teo.db.adapter.waterline",
            adapterConfig: {
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

        loadOrmStub.restore();
        createOrmStub.restore();

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
            ormName: "waterline",
            adapterName: "teo.db.adapter.waterline",
            adapterConfig: {}
        });

        assert.isFalse(loadOrmStub.calledOnce, "Load ORM method should not be called");

    });

    it("Should not call load ORM", () => {

        createOrmStub.reset();

        new Db({
            enabled: false,
            ormName: "waterline",
            adapterName: "teo.db.adapter.waterline",
            adapterConfig: {}
        });

        assert.isFalse(createOrmStub.calledOnce, "Create ORM method should not be called");

    });

    it("Should parse config correctly", () => {

        assert.equal(db.config.ormPath, path.join(db.homeDir, "orm"), "Default ORM path should be set to the 'homeDir/orm'");
        assert.equal(db.config.ormPrefix, "teo.db.orm.", "Default ORM prefix should be teo.db.orm.");
        assert.equal(db.config.adapterName, "teo.db.adapter.waterline", "ORM adapter name is not correct");
        assert.deepEqual(db.config.adapterConfig, {
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

});