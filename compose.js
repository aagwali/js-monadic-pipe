module.exports = ({ types: t }) => ({
  visitor: {
    BinaryExpression(path) {
      if (!t.isBinaryExpression(path.node, { operator: '&' })) {
        return
      }

      const flatten = node =>
        t.isBinaryExpression(node, { operator: '&' })
          ? [...flatten(node.left), ...flatten(node.right)]
          : [node]

      const [head, ...tail] = flatten(path.node)

      path.replaceWith(
        t.arrowFunctionExpression(
          [t.identifier('x')],
          tail.reduce(
            (expr, call) => t.callExpression(call, [expr]),
            t.callExpression(head, [t.identifier('x')])
          )
        )
      )
    }
  }
})
