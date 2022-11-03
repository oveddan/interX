/* eslint-disable max-len */
import { HasIScene } from '../../Abstractions/AbstractionImplementationMap.js';
import { getNodeDescriptions } from '../../Nodes/getNodeDescriptions.js';
import { NodeDescription } from '../../Nodes/NodeDescription.js';
import { Registry, TAbstractionsConstraint } from '../../Registry.js';
import { registerSerializersForValueType } from '../Core/registerSerializersForValueType.js';
import { SetSceneProperty } from './Actions/SetSceneProperty.js';
import { OnSceneNodeClick } from './Events/OnSceneNodeClick.js';
import { GetSceneProperty } from './Queries/GetSceneProperty.js';
import * as ColorNodes from './Values/ColorNodes.js';
import { ColorValue } from './Values/ColorValue.js';
import * as EulerNodes from './Values/EulerNodes.js';
import { EulerValue } from './Values/EulerValue.js';
import * as QuatNodes from './Values/QuatNodes.js';
import { QuatValue } from './Values/QuatValue.js';
import * as Vec2Nodes from './Values/Vec2Nodes.js';
import { Vec2Value } from './Values/Vec2Value.js';
import * as Vec3Nodes from './Values/Vec3Nodes.js';
import { Vec3Value } from './Values/Vec3Value.js';
import * as Vec4Nodes from './Values/Vec4Nodes.js';
import { Vec4Value } from './Values/Vec4Value.js';

export function registerSceneProfile<T extends HasIScene>(registry: Registry<T>) {
  const { values, nodes } = registry;

  // pull in value type nodes
  values.register(Vec2Value);
  values.register(Vec3Value);
  values.register(Vec4Value);
  values.register(ColorValue);
  values.register(EulerValue);
  values.register(QuatValue);

  // pull in value type nodes
  nodes.register(...getNodeDescriptions<T>(Vec2Nodes));
  nodes.register(...getNodeDescriptions<T>(Vec3Nodes));
  nodes.register(...getNodeDescriptions<T>(Vec4Nodes));
  nodes.register(...getNodeDescriptions<T>(ColorNodes));
  nodes.register(...getNodeDescriptions<T>(EulerNodes));
  nodes.register(...getNodeDescriptions<T>(QuatNodes));

  // events

  const onSceneNodeClickDescription = OnSceneNodeClick.Description<T>();
  nodes.register(...[onSceneNodeClickDescription]);

  // actions
  const allValueTypeNames = values.getAllNames();
  nodes.register(...SetSceneProperty.GetDescriptions<T>(...allValueTypeNames));
  nodes.register(...GetSceneProperty.GetDescriptions<T>(...allValueTypeNames));

  const newValueTypeNames = ['vec2', 'vec3', 'vec4', 'quat', 'euler', 'color'];

  // variables

  newValueTypeNames.forEach((valueTypeName) => {
    registerSerializersForValueType(registry, valueTypeName);
  });

  return registry;
}
