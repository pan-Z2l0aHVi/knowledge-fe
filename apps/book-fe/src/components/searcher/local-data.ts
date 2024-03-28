import type { RouteItem } from '@/router/routes'
import { routes } from '@/router/routes'

function find_matched_routes(keywords: string, route_list: RouteItem[], result: RouteItem[], path_prefix: string) {
  route_list.forEach(route => {
    if (route.children?.length) {
      return find_matched_routes(keywords, route.children, result, `${path_prefix}/${route.path}`)
    }
    if (route.meta?.title) {
      const route_title = route.meta.title().toLowerCase()
      if (route_title.includes(keywords.toLowerCase())) {
        result.push({
          ...route,
          path: `${path_prefix}/${route.path}`
        })
      }
    }
  })
  return result
}

export function get_local_data(keywords: string): RouteItem[] {
  return find_matched_routes(keywords, routes, [], '')
}
