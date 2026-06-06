"use client"

import { Input } from "@/components/ui/input"
import { MapPin, Menu, ShoppingBag, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFindTreeDataCategories } from "@/hooks/apis/use-category"
import Image from "next/image"

export function Header() {
  return (
    <header className="grid h-16 grid-cols-12 bg-blue-500">
      <div className="col-span-2"></div>
      <div className="col-span-8 flex items-center">
        <Logo />
        <div className="ml-10">
          <Category />
        </div>
        <div className="ml-10 w-96">
          <Input
            className="bg-white text-black placeholder:text-gray-500"
            placeholder="Tìm kiếm sản phẩm..."
            size={122}
          />
        </div>
        <Login />
        <Cart />
        <Address />
      </div>
      <div className="col-span-2"></div>
    </header>
  )
}

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center gap-x-2 text-yellow-300"
    >
      <ShoppingBag className="size-6!" />
      <strong className="text-base font-semibold">E-commerce.</strong>
    </Link>
  )
}

function Category() {
  const { data } = useFindTreeDataCategories()
  const categories = data?.metadata || []
  console.log(categories)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg" className="text-white">
          <Menu />
          <span>Danh mục</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="start">
        <DropdownMenuGroup className="space-y-1">
          {categories.map((category) => {
            const hasChildren =
              category.children && category.children.length > 0
            const children = category.children || []

            if (!hasChildren) {
              return (
                <DropdownMenuItem key={category.id}>
                  {category.name}
                </DropdownMenuItem>
              )
            }

            return (
              <DropdownMenuSub key={category.id}>
                <DropdownMenuSubTrigger>{category.name}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="p-4 pt-2">
                    <DropdownMenuLabel className="mb-2">
                      {category.name}
                    </DropdownMenuLabel>
                    <div className="flex max-w-190 flex-wrap gap-x-4 gap-y-6">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex cursor-pointer flex-col items-center space-y-1 rounded-2xl p-2 hover:bg-slate-100"
                        >
                          <Image
                            src={child.image.url}
                            alt={child.name}
                            width={50}
                            height={50}
                            className="h-12.5 w-12.5 overflow-hidden rounded-md object-cover"
                          />
                          <p className="line-clamp-2 max-w-32">{child.name}</p>
                        </div>
                      ))}
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex cursor-pointer flex-col items-center space-y-1 rounded-2xl p-2 hover:bg-slate-100"
                        >
                          <Image
                            src={child.image.url}
                            alt={child.name}
                            width={50}
                            height={50}
                            className="h-12.5 w-12.5 overflow-hidden rounded-md object-cover"
                          />
                          <p className="line-clamp-2 max-w-32">{child.name}</p>
                        </div>
                      ))}
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex cursor-pointer flex-col items-center space-y-1 rounded-2xl p-2 hover:bg-slate-100"
                        >
                          <Image
                            src={child.image.url}
                            alt={child.name}
                            width={50}
                            height={50}
                            className="h-12.5 w-12.5 overflow-hidden rounded-md object-cover"
                          />
                          <p className="line-clamp-2 max-w-32">{child.name}</p>
                        </div>
                      ))}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Login() {
  return (
    <Link href="/purchase-history/login">
      <Button className="ml-10 text-white" variant="ghost" size="lg">
        <User />
        <span>Đăng nhập</span>
      </Button>
    </Link>
  )
}

function Cart() {
  return (
    <Link href="/cart">
      <Button className="ml-10 text-white" variant="ghost" size="lg">
        <ShoppingCart />
        <span>Giỏ hàng</span>
      </Button>
    </Link>
  )
}

function Address() {
  return (
    <Button className="ml-10 flex-1 text-white" variant="ghost" size="lg">
      <MapPin />
      <span>Địa chỉ</span>
    </Button>
  )
}
