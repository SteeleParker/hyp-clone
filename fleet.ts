enum ShipComponentSize {
    small, /** Scout */
    medium, /** Destroyer / Bomber */
    large, /** Cruiser */
    capital, /** Suncruiser, Starbase */
}

/**
 * Every item that can be attached to a ship is a component
 */
interface ShipComponent {
    /**
     * Component Mass
     * 
     * @description The mass of the individual component for calculating ship speed (evasiveness)
     */
    readonly mass: number;
    /**
     * Component Cost
     * 
     * @description Specifies the cost of attaching this component to a ship
     */
    readonly cost: number;
    /** Category */
    readonly size: ShipComponentSize;
}

interface ShipChasis extends ShipComponent {
    /** Base hitpoints of the ship type */
    readonly hitPoints: number;
    /** Total number of engine slots on the ship */
    readonly engineSlots: number;
    /** Type of engines which the ship can use */
    readonly engineSlotSize: ShipComponentSize;
    /** Total number of weapon slots on the ship */
    readonly weaponSlots: number;
    /** Type of weapons which the ship can use */
    readonly weaponSlotSize: number;
}

interface ShipWeapon extends ShipComponent {
    /** How many different targets can be hit per tick by this weapon */
    readonly shotsPerTick: number;
    /** How many hitpoints each shot removes from a target */
    readonly damagePerShot: number;
    /** Higher value means higher chance to hit the target */
    readonly trackingSpeed: number;
}

interface ShipEngine extends ShipComponent {
    /** Thrust of the ship engine */
    readonly thrust: number;
}

interface ShipDefence extends ShipComponent {
    /** How many hitpoints does the defence grant, if any */
    readonly hitPoints: number;
    /** How many hitpoints does the defence regenerate per tick, if any */
    readonly regenPerTick: number;
}

class ShipConfig {
    public chasis: ShipChasis;
    public weapons: ShipWeapon[];
    public engines: ShipEngine[];
    public defences: ShipDefence[];  
}

/**
 * Util abstract getters are supported by typescript (as they are in typescript@next) then
 * 
 */
class Ship extends ShipConfig implements ShipComponent {
    public chasis: ShipChasis;
    public weapons: ShipWeapon[];
    public engines: ShipEngine[];
    public defences: ShipDefence[];

    get size():ShipComponentSize {
        return this.chasis.size;
    }

    private getComponentsMass = (components:ShipComponent[]) => ( components.reduce( (accumulator, component ) => accumulator+component.mass, 0) );
    private getWeaponMass = ():number => this.getComponentsMass(this.weapons);
    private getEngineMass = ():number => this.getComponentsMass(this.engines);
    private getDefenceMass = ():number => this.getComponentsMass(this.defences);

    private getComponentsCost = (components:ShipComponent[]) => ( components.reduce( (accumulator, component ) => accumulator+component.cost, 0) );
    private getWeaponCost = ():number => this.getComponentsCost(this.weapons);
    private getEngineCost = ():number => this.getComponentsCost(this.engines);
    private getDefenceCost = ():number => this.getComponentsCost(this.defences);

    private getThrust = ():number => ( this.engines.reduce( (accumulator, engine ) => accumulator+engine.thrust, 0) );

    get cost():number {
        return this.chasis.cost
            + this.getWeaponCost()
            + this.getEngineCost()
            + this.getDefenceCost()
        ;
    }

    get mass():number {
        return this.chasis.mass
            + this.getWeaponMass()
            + this.getEngineMass()
            + this.getDefenceMass()
        ;
    }

    constructor(config:ShipConfig) {
        super();

        Object.assign(this, config);
    }
}

class FleetChunk {
    ship: Ship;
    count: number;

    constructor(chunk:FleetChunk) {
        Object.assign(this, chunk);
    }
}

class Fleet {
    chunks: FleetChunk[];

    constructor(fleet:Fleet) {
        Object.assign(this, fleet);
    }
}

class IBattle {
    attackers: Fleet[] = [];
    defenders: Fleet[] = [];
}

class Battle extends IBattle {

    public battleTick() {
        console.log("Simulating Battle Tick");
        /*
            Foreach fleet
                Identify the targets
        */
    }

    constructor(battle:IBattle) {
        super();

        Object.assign(this, battle);
    }
}

const Chasis:{ [key:string]:ShipChasis } = {
    Scout : {
        size: ShipComponentSize.small,
        mass: 1500,
        cost: 1500,
        hitPoints: 5,
        engineSlots: 2,
        engineSlotSize: ShipComponentSize.small,
        weaponSlots: 4,
        weaponSlotSize: ShipComponentSize.small,
    }
};

const Weapon:{ [key:string]:ShipWeapon } = {
    SmallProjectile : {
        size: ShipComponentSize.small,
        mass: 5,
        cost: 50,
        shotsPerTick: 5,
        damagePerShot: 1,
        trackingSpeed: 500,
    }
}

const Engine:{ [key:string]:ShipEngine } = {
    SmallThruster : {
        size: ShipComponentSize.small,
        mass: 5,
        cost: 500,
        thrust: 5
    }
}

const Defence:{ [key:string]:ShipDefence } = {
    SmallArmour : {
        size: ShipComponentSize.small,
        hitPoints: 10,
        regenPerTick: 0,
        mass: 50,
        cost: 50
    }
}

const shipDesign1 = new Ship({
    chasis: Chasis.Scout,
    weapons: [
        Weapon.SmallProjectile,
        Weapon.SmallProjectile
    ],
    engines: [
        Engine.SmallThruster
    ],
    defences: [
        Defence.SmallArmour
    ]
});

const fleetChunk1 = new FleetChunk({
    ship: shipDesign1,
    count: 100000
});

const fleet1 = new Fleet({
    chunks: [fleetChunk1]
});

const fleetChunk2 = new FleetChunk({
    ship: shipDesign1,
    count: 100000
});

const fleet2 = new Fleet({
    chunks: [fleetChunk2]
});

const battle = new Battle({
    attackers: [fleet1],
    defenders: [fleet2]
});

battle.battleTick();
