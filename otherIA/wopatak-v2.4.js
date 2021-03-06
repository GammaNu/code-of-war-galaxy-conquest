// Generated by CoffeeScript 1.6.3
(function() {
  var Galaxy, Game, GameUtil, Order, Planet, PlanetPopulation, PlanetSize, Point, Range, Ship, TurnMessage, TurnResult, UID, color, debugMessage, enemyId, getNearestPlanet, getOrders, getOtherPlayerId, getOtherPlayerPlanets, id, name, shuffle;

  name = "Wopatak";

  color = 0;

  debugMessage = '';

  id = 0;

  enemyId = -1;

  this.onmessage = function(event) {
    var turnMessage;
    if (event.data != null) {
      turnMessage = event.data;
      id = turnMessage.playerId;
      return postMessage(new TurnResult(getOrders(turnMessage.galaxy), debugMessage));
    } else {
      return postMessage("data null");
    }
  };

  Galaxy = (function() {
    function Galaxy(width, height) {
      this.width = width;
      this.height = height;
      /*contenu : liste Planet*/

      this.content = [];
      /*flote : liste de Ship*/

      this.fleet = [];
    }

    return Galaxy;

  })();

  Range = (function() {
    function Range(from, to) {
      this.from = from;
      this.to = to;
    }

    return Range;

  })();

  Order = (function() {
    function Order(sourceID, targetID, numUnits) {
      this.sourceID = sourceID;
      this.targetID = targetID;
      this.numUnits = numUnits;
    }

    return Order;

  })();

  Planet = (function() {
    function Planet(x, y, size, owner) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.owner = owner;
      /* population*/

      this.population = PlanetPopulation.getDefaultPopulation(size);
      /* id*/

      this.id = UID.get();
    }

    return Planet;

  })();

  Ship = (function() {
    function Ship(crew, source, target, creationTurn) {
      this.crew = crew;
      this.source = source;
      this.target = target;
      this.creationTurn = creationTurn;
      /* proprietaire du vaisseau*/

      this.owner = source.owner;
      /* duree du voyage en nombre de tour*/

      this.travelDuration = Math.ceil(GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(target.x, target.y)) / Game.SHIP_SPEED);
    }

    return Ship;

  })();

  TurnMessage = (function() {
    function TurnMessage(playerId, galaxy) {
      this.playerId = playerId;
      this.galaxy = galaxy;
    }

    return TurnMessage;

  })();

  TurnResult = (function() {
    function TurnResult(orders, consoleMessage) {
      this.orders = orders;
      this.consoleMessage = consoleMessage != null ? consoleMessage : "";
      this.error = "";
    }

    return TurnResult;

  })();

  Point = (function() {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    return Point;

  })();

  GameUtil = (function() {
    function GameUtil() {}

    GameUtil.getDistanceBetween = function(p1, p2) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    GameUtil.getPlayerPlanets = function(planetOwnerId, context) {
      var p, result, _i, _len, _ref;
      result = [];
      _ref = context.content;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.owner.id === planetOwnerId) {
          result.push(p);
        }
      }
      return result;
    };

    GameUtil.getEnnemyPlanets = function(planetOwnerId, context) {
      var p, result, _i, _len, _ref;
      result = [];
      _ref = context.content;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.owner.id !== planetOwnerId) {
          result.push(p);
        }
      }
      return result;
    };

    return GameUtil;

  })();

  UID = (function() {
    function UID() {}

    UID.lastUID = 0;

    UID.get = function() {
      UID.lastUID++;
      return UID.lastUID;
    };

    return UID;

  })();

  Game = (function() {
    function Game() {}

    Game.DEFAULT_PLAYER_POPULATION = 100;

    Game.NUM_PLANET = new Range(5, 10);

    Game.PLANET_GROWTH = 5;

    Game.SHIP_SPEED = 60;

    Game.GAME_SPEED = 500;

    Game.GAME_DURATION = 240;

    Game.GAME_MAX_NUM_TURN = 500;

    return Game;

  })();

  PlanetPopulation = (function() {
    function PlanetPopulation() {}

    PlanetPopulation.DEFAULT_SMALL = 20;

    PlanetPopulation.DEFAULT_NORMAL = 30;

    PlanetPopulation.DEFAULT_BIG = 40;

    PlanetPopulation.DEFAULT_HUGE = 50;

    PlanetPopulation.MAX_SMALL = 50;

    PlanetPopulation.MAX_NORMAL = 100;

    PlanetPopulation.MAX_BIG = 200;

    PlanetPopulation.MAX_HUGE = 300;

    PlanetPopulation.getMaxPopulation = function(planetSize) {
      var result;
      result = 1;
      switch (planetSize) {
        case PlanetSize.SMALL:
          result = PlanetPopulation.MAX_SMALL;
          break;
        case PlanetSize.NORMAL:
          result = PlanetPopulation.MAX_NORMAL;
          break;
        case PlanetSize.BIG:
          result = PlanetPopulation.MAX_BIG;
          break;
        case PlanetSize.HUGE:
          result = PlanetPopulation.MAX_HUGE;
      }
      return result;
    };

    PlanetPopulation.getDefaultPopulation = function(planetSize) {
      var result;
      result = 1;
      switch (planetSize) {
        case PlanetSize.SMALL:
          result = PlanetPopulation.DEFAULT_SMALL;
          break;
        case PlanetSize.NORMAL:
          result = PlanetPopulation.DEFAULT_NORMAL;
          break;
        case PlanetSize.BIG:
          result = PlanetPopulation.DEFAULT_BIG;
          break;
        case PlanetSize.HUGE:
          result = PlanetPopulation.DEFAULT_HUGE;
      }
      return result;
    };

    return PlanetPopulation;

  })();

  PlanetSize = (function() {
    function PlanetSize() {}

    PlanetSize.SMALL = 1;

    PlanetSize.NORMAL = 2;

    PlanetSize.BIG = 3;

    PlanetSize.HUGE = 4;

    return PlanetSize;

  })();

  shuffle = function(o) {
    var i, j, x;
    j = void 0;
    x = void 0;
    i = o.length;
    while (i) {
      j = Math.floor(Math.random() * i);
      x = o[--i];
      o[i] = o[j];
      o[j] = x;
    }
    return o;
  };

  getOrders = function(context) {
    var currentPopulation, enemyPipo, enemyPlanets, myPlanet, myPlanets, otherPipo, otherPlanets, pipo, pipoPlanets, result, _i, _j, _len, _len1;
    result = [];
    myPlanets = GameUtil.getPlayerPlanets(id, context);
    otherPlanets = GameUtil.getEnnemyPlanets(id, context);
    if (enemyId < 0) {
      enemyId = getOtherPlayerId(id, context);
    }
    enemyPlanets = getOtherPlayerPlanets(enemyId, context);
    if (enemyPlanets !== null && enemyPlanets.length > 0 && otherPlanets !== null && otherPlanets.length > 0) {
      for (_i = 0, _len = myPlanets.length; _i < _len; _i++) {
        myPlanet = myPlanets[_i];
        otherPipo = shuffle(otherPlanets).slice(0, 5);
        enemyPipo = shuffle(enemyPlanets).slice(0, 5);
        pipoPlanets = [otherPipo, enemyPipo];
        pipoPlanets = [].concat.apply([], pipoPlanets);
        for (_j = 0, _len1 = pipoPlanets.length; _j < _len1; _j++) {
          pipo = pipoPlanets[_j];
          result.push(new Order(myPlanet.id, pipo.id, 0));
        }
        currentPopulation = myPlanet.population;
        if (currentPopulation >= 5) {
          if (currentPopulation - 5 !== 0) {
            result.push(new Order(myPlanet.id, getNearestPlanet(myPlanet, enemyPlanets).id, currentPopulation - 5));
          }
          currentPopulation -= 5;
        }
      }
    }
    return result;
  };

  getOtherPlayerId = function(id, context) {
    var planets;
    planets = GameUtil.getEnnemyPlanets(id, context);
    return planets[0].owner.id;
  };

  getNearestPlanet = function(source, candidats) {
    var currentDist, dist, element, result, _i, _len;
    result = candidats[0];
    currentDist = GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(result.x, result.y));
    for (_i = 0, _len = candidats.length; _i < _len; _i++) {
      element = candidats[_i];
      dist = GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(element.x, element.y));
      if (currentDist > dist) {
        currentDist = dist;
        result = element;
      }
    }
    return result;
  };

  getOtherPlayerPlanets = function(id, context) {
    var planet, planets, _i, _len, _ref;
    planets = [];
    _ref = context.content;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      planet = _ref[_i];
      if (planet.owner.id === id) {
        planets.push(planet);
      }
    }
    return planets;
  };

}).call(this);
