import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  to_do: {
    label: "To do",
    color: "var(--chart-1)",
  },
  blog_post: {
    label: "Blog Post",
    color: "var(--chart-2)",
  },
  contact_manager: {
    label: "Contact",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { contacts, items, posts, users, chartData } = usePage().props as unknown as {
        contacts: number;
        items: number;
        posts: number;
        users: number;
        chartData: {
            date: string
            to_do: number
            blog_post: number
            contact_manager: number
        }[]
    };

    const data = { users, items, posts, contacts };

    const modules = [
        { key: 'users', title: 'Total Users', description: 'Total number of registered users.', detail: 'User registrations are increasing steadily.' },
        { key: 'items', title: 'To-Do Items Created', description: 'Total tasks added by users to their to-do lists.', detail: 'Shows daily task creation trends.' },
        { key: 'posts', title: 'Blog Posts Published', description: 'Total blog posts published by users.', detail: 'Engagement through content publishing is growing.' },
        { key: 'contacts', title: 'Contacts Added', description: 'Total contacts stored or managed by users.', detail: 'Reflects user networking and CRM activity.' },
    ];

    const [timeRange, setTimeRange] = React.useState("90d")
    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
        daysToSubtract = 30
        } else if (timeRange === "7d") {
        daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {modules.map((module) => (
                        <Card key={module.key} className="@container/card">
                        <CardHeader>
                            <CardDescription>{module.title}</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {data[module.key as keyof typeof data] ?? 0}
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">{module.description}</div>
                            <div className="text-muted-foreground">{module.detail}</div>
                        </CardFooter>
                        </Card>
                    ))}
                
                    <Card className="pt-0 col-span-4">
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1">
                            <CardTitle>Daily Activity Tracker - Sari Saring Web App</CardTitle>
                            <CardDescription>
                                Showing data for the last {timeRange === "90d" ? "3 months" : timeRange === "30d" ? "30 days" : "7 days"}
                            </CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger
                                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                                aria-label="Select a value"
                            >
                                <SelectValue placeholder="Last 3 months" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                                </SelectItem>
                                <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                                </SelectItem>
                                <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                                </SelectItem>
                            </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            {filteredData.length > 0 ? (
                                <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[250px] w-full"
                                >
                                <AreaChart data={filteredData}>
                                    <defs>
                                    <linearGradient id="fillTo_do" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-to_do)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-to_do)" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="fillBlog_post" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-blog_post)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-blog_post)" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="fillContact_manager" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-contact_manager)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-contact_manager)" stopOpacity={0.1} />
                                    </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        })
                                    }}
                                    />
                                    <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            })
                                        }}
                                        indicator="dot"
                                        />
                                    }
                                    />
                                    <Area
                                    dataKey="to_do"
                                    type="natural"
                                    fill="url(#fillTo_do)"
                                    stroke="var(--color-to_do)"
                                    stackId="a"
                                    />
                                    <Area
                                    dataKey="blog_post"
                                    type="natural"
                                    fill="url(#fillBlog_post)"
                                    stroke="var(--color-blog_post)"
                                    stackId="a"
                                    />
                                    <Area
                                    dataKey="contact_manager"
                                    type="natural"
                                    fill="url(#fillContact_manager)"
                                    stroke="var(--color-contact_manager)"
                                    stackId="a"
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </AreaChart>
                                </ChartContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                No data yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    </div>
                </div>
            {/* </div> */}
        </AppLayout>
    );
}
