import {
  Registry,
  Vec2Value,
  Vec3Value,
  Vec4Value,
  ColorValue,
  EulerValue,
  QuatValue,
  getNodeDescriptions,
  Vec2Nodes,
  Vec3Nodes,
  Vec4Nodes,
  ColorNodes,
  EulerNodes,
  QuatNodes,
  SetSceneProperty,
  GetSceneProperty,
  IScene,
} from '@behave-graph/core';
import { registerSerializersForValueType } from '@behave-graph/core/src/Profiles/Core/registerSerializersForValueType';
import { ISceneWithQueries, IChainGraph } from '../abstractions';
import { ChainCounter } from '../nodes/chain/ChainCounter';
import { ChainVariableSet } from '../nodes/chain/ChainVariableSet';
import { ExternalTrigger } from '../nodes/chain/ExternalTrigger';
import { OnSceneNodeClick } from '../nodes/scene/OnSceneNodeClick';

export function registerSharedSceneProfiles(registry: Registry, scene: IScene) {
  const { values, nodes } = registry;

  // pull in value type nodes
  values.register(Vec2Value);
  values.register(Vec3Value);
  values.register(Vec4Value);
  values.register(ColorValue);
  values.register(EulerValue);
  values.register(QuatValue);

  // pull in value type nodes
  nodes.register(...getNodeDescriptions(Vec2Nodes));
  nodes.register(...getNodeDescriptions(Vec3Nodes));
  nodes.register(...getNodeDescriptions(Vec4Nodes));
  nodes.register(...getNodeDescriptions(ColorNodes));
  nodes.register(...getNodeDescriptions(EulerNodes));
  nodes.register(...getNodeDescriptions(QuatNodes));

  // // actions
  const allValueTypeNames = values.getAllNames();
  nodes.register(...SetSceneProperty.GetDescriptions(scene, ...allValueTypeNames));
  nodes.register(...GetSceneProperty.GetDescriptions(scene, ...allValueTypeNames));

  const newValueTypeNames = ['vec2', 'vec3', 'vec4', 'quat', 'euler', 'color'];

  // variables

  newValueTypeNames.forEach((valueTypeName) => {
    registerSerializersForValueType(
      // @ts-ignore
      registry,
      valueTypeName
    );
  });
}

export function registerSpecificSceneProfiles(registry: Registry, scene: ISceneWithQueries) {
  const { nodes } = registry;

  nodes.register(OnSceneNodeClick.Description(scene));
}
