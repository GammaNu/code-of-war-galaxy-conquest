(function() {
  var Galaxy, Game, GameUtil, Order, Planet, PlanetPopulation, PlanetSize, Point, Range, Ship, TurnMessage, TurnResult, UID, color, croissanceParTour, debugMessage, getEasyestPlanet, getNearestPlanet, getOrders, id, name, naturalPopInXTurn, orderCall;

  name = "IA 1nomable";

  color = 0;

  debugMessage = "";

  id = 0;

  orderCall = 0;

  croissanceParTour = 5;

  /*
    @internal method
  */


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

  /*
    Invoquée tous les tours pour recuperer la liste des ordres à exécuter.
    C'est la methode à modifier pour cabler son IA.
    @param context:Galaxy
    @return result:Array<Order>
  */


  getOrders = function(context) {
    var e, myPlanet, myPlanets, otherPlanets, populationGoal, result, target, _i, _len;
    result = [];
    try {
      myPlanets = GameUtil.getPlayerPlanets(id, context);
      otherPlanets = GameUtil.getEnnemyPlanets(id, context);
      if (otherPlanets !== null && otherPlanets.length > 0) {
        for (_i = 0, _len = myPlanets.length; _i < _len; _i++) {
          myPlanet = myPlanets[_i];
          target = getEasyestPlanet(myPlanet, otherPlanets);
          populationGoal = 1 + naturalPopInXTurn(target, GameUtil.getTravelNumTurn(myPlanet, target));
          if (myPlanet.population > populationGoal) {
            result.push(new Order(myPlanet.id, target.id, populationGoal));
          }
        }
      }
      orderCall++;
      debugMessage = 'Tour ' + orderCall;
    } catch (_error) {
      e = _error;
      debugMessage += e;
    }
    return result;
  };

  naturalPopInXTurn = function(planet, turn) {
    return Math.min(planet.population + turn * croissanceParTour, PlanetPopulation.getMaxPopulation(planet.size));
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

  getEasyestPlanet = function(source, candidats) {
    var difficulty, element, minDifficulty, result, _i, _len;
    result = candidats[0];
    minDifficulty = naturalPopInXTurn(candidats[0], GameUtil.getTravelNumTurn(source, candidats[0]));
    for (_i = 0, _len = candidats.length; _i < _len; _i++) {
      element = candidats[_i];
      difficulty = naturalPopInXTurn(element, GameUtil.getTravelNumTurn(source, element));
      if (minDifficulty > difficulty) {
        minDifficulty = difficulty;
        result = element;
      }
    }
    return result;
  };

  /*
    @model Galaxy
    @param width:Number largeur de la galaxy
    @param height:Number hauteur de la galaxy
  */


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

  /*
    @model Range
    @param from:Number début de l'intervale
    @param to:Number fin de l'intervale
  */


  Range = (function() {
    function Range(from, to) {
      this.from = from;
      this.to = to;
    }

    return Range;

  })();

  /*
    @model Order
    @param sourceID:Number id de la planete d'origine
    @param targetID:Number id de la planete cible
    @param numUnits:Number nombre d'unité à déplacer
  */


  Order = (function() {
    function Order(sourceID, targetID, numUnits) {
      this.sourceID = sourceID;
      this.targetID = targetID;
      this.numUnits = numUnits;
    }

    return Order;

  })();

  /*
    @model Planet
    @param x:Number position en x
    @param y:Number position en y
    @param size:Number taille
    @param owner:Player proprietaire
  */


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

  /*
    @model Ship
    @param crew:Number equipage
    @param source:Planet origine
    @param target:Planet cible
    @param creationTurn:Number numero du tour de creation du vaisseau
  */


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

  /*
    @internal model
  */


  TurnMessage = (function() {
    function TurnMessage(playerId, galaxy) {
      this.playerId = playerId;
      this.galaxy = galaxy;
    }

    return TurnMessage;

  })();

  /*
    @internal model
  */


  TurnResult = (function() {
    function TurnResult(orders, consoleMessage) {
      this.orders = orders;
      this.consoleMessage = consoleMessage != null ? consoleMessage : "";
      this.error = "";
    }

    return TurnResult;

  })();

  /*
    @model Point
    @param x:Number
    @param y:Number
  */


  Point = (function() {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    return Point;

  })();

  /*
    Classe utilitaire
  */


  GameUtil = (function() {
    function GameUtil() {}

    /*
    	  @param p1:Point
    	  @param p2:Point
    	  @return result:Number la distance entre deux points
    */


    GameUtil.getDistanceBetween = function(p1, p2) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    /*
    	  @param planetOwnerId:Number
    	  @param context:Galaxy
    	  @return result:Array<Planet> la liste des planetes appartenants à un joueur en particulier
    */


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

    /*
    	 @param planetOwnerId:Number
    	 @param context:Galaxy
    	 @return result:Array<Planet> la liste des planetes ennemies et neutres
    */


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

    GameUtil.getEnnemyFleet = function(playerId, context) {
      var result, s, _i, _len, _ref;
      result = [];
      _ref = context.fleet;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        if (s.owner.id !== playerId) {
          result.push(s);
        }
      }
      return result;
    };

    GameUtil.getTravelNumTurn = function(source, target) {
      return Math.ceil(GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(target.x, target.y)) / Game.SHIP_SPEED);
    };

    return GameUtil;

  })();

  /*
    Classe utilitaire
    @internal
  */


  UID = (function() {
    function UID() {}

    UID.lastUID = 0;

    UID.get = function() {
      UID.lastUID++;
      return UID.lastUID;
    };

    return UID;

  })();

  /*
    Constantes
  */


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

}).call(this);
