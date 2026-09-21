export interface ResourceScope {
  readonly resourceType: string;
  readonly resourceIds?: readonly string[];
}

export const scopeAllows = (
  scope: ResourceScope,
  resourceType: string,
  resourceId?: string,
): boolean => {
  if (scope.resourceType !== resourceType) {
    return false;
  }

  if (!scope.resourceIds || scope.resourceIds.length === 0) {
    return true;
  }

  return resourceId !== undefined && scope.resourceIds.includes(resourceId);
};
