import * as CANNON from 'cannon-es'

export const addBounds = (scale: number, world: CANNON.World) => {
    const material = new CANNON.Material({ restitution: 1, friction: 0 })

    // floor
    const ground = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material,
    })
    ground.position.y = -scale * 0.5
    // face up
    ground.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
    world.addBody(ground)

    // ceiling
    const ceiling = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material,
    })
    ceiling.position.y = scale * 0.5
    // face up
    ceiling.quaternion.setFromEuler(Math.PI * 0.5, 0, 0)
    world.addBody(ceiling)

    // north wall
    const north = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material,
    })
    north.position.z = -scale * 0.5
    world.addBody(north)

    // south wall
    const south = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material,
    })
    south.quaternion.setFromEuler(0, Math.PI, 0)
    south.position.z = scale * 0.5
    world.addBody(south)

    // west wall
    const west = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material,
    })
    west.quaternion.setFromEuler(0, Math.PI * 0.5, 0)
    west.position.x = scale * -0.5
    world.addBody(west)

    // east wall
    const east = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material,
    })
    east.quaternion.setFromEuler(0, Math.PI * -0.5, 0)
    east.position.x = scale * 0.5
    world.addBody(east)

    return [ground, ceiling, north, south, east, west]
}
