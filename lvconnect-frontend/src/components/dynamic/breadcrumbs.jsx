import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Breadcrumbs({ rootName = "Home", rootHref = "/" , name}) {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean)

  const parentSegment = segments.at(-2)
  const currentSegment = segments.at(-1)
  const parentHref = "/" + segments.slice(0, -1).join("/")

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={rootHref} className="capitalize no-underline hover:no-underline text-blue-900">
              {rootName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {currentSegment && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize text-blue-900">
                  {name || decodeURIComponent(currentSegment)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
