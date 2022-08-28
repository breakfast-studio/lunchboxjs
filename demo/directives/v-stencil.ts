import { Directive } from 'vue'
import { Lunch } from '../../'
import { NotEqualStencilFunc, EqualStencilFunc, KeepStencilOp } from 'three'

export const stencil: Directive<Lunch.Node<THREE.Mesh>> = {
    updated(el, binding) {
        if (!el.instance) return

        el.instance.renderOrder = 2
        const inverted = binding.modifiers.inverted
        const mat = el.instance.material as any

        mat.stencilWrite = true
        mat.stencilRef = binding.value?.stencilRef ?? 1
        mat.stencilFunc =
            inverted ?? false ? NotEqualStencilFunc : EqualStencilFunc
        mat.stencilFail = KeepStencilOp
        mat.stencilZFail = KeepStencilOp
        mat.stencilZPass = KeepStencilOp
    },
}
