'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowUp,
  ArrowDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Safari,
  Firefox,
  Globe2,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  MapPin,
  ExternalLink,
  RefreshCw,
  Loader2,
} from 'lucide-react'

interface AnalyticsData {
  range: string
  startDate: string
  endDate: string
  totals: {
    totalPageViews: number
    totalUniqueVisitors: number
    totalSessions: number
    avgSessionDuration: number
    bounceRate: number
    totalOrganicTraffic: number
    totalDirectTraffic: number
    totalReferralTraffic: number
    totalSocialTraffic: number
    totalEmailTraffic: number
  }
  daily: Array<{
    date: string
    pageViews: number
    uniqueVisitors: number
    sessions: number
  }>
  topPages: Array<{ path: string; views: number }>
  topReferrers: Array<{ host: string | null; count: number }>
  devices: Array<{ device: string | null; count: number }>
  browsers: Array<{ browser: string | null; count: number }>
  os: Array<{ os: string | null; count: number }>
  countries: Array<{ country: string | null; count: number }>
  pageTypes: Array<{ type: string | null; count: number }>
  clicks: {
    byType: Array<{ type: string | null; count: number }>
    top: Array<{ type: string | null; text: string | null; href: string | null; count: number }>
  }
  realtime: {
    activeNow: number
    pageViewsLastHour: number
    clicksLastHour: number
  }
}

const deviceIcons: Record<string, any> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

const browserIcons: Record<string, any> = {
  Chrome: Chrome,
  Safari: Safari,
  Firefox: Firefox,
  Edge: Globe2,
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('7d')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/stats?range=${range}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [range])

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(fetchAnalytics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, range])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0
    return ((value / total) * 100).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive insights into your website traffic and user behavior
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => fetchAnalytics()}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{data.realtime.activeNow}</div>
              <div className="text-sm opacity-80">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{data.realtime.pageViewsLastHour}</div>
              <div className="text-sm opacity-80">Page Views (Last Hour)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{data.realtime.clicksLastHour}</div>
              <div className="text-sm opacity-80">Clicks (Last Hour)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Total Page Views
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(data.totals.totalPageViews)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Unique Visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(data.totals.totalUniqueVisitors)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Session Duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatDuration(data.totals.avgSessionDuration)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Bounce Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totals.bounceRate?.toFixed(1) || 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Where your visitors come from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(data.totals.totalDirectTraffic)}</div>
              <div className="text-sm text-gray-500">Direct</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatNumber(data.totals.totalOrganicTraffic)}</div>
              <div className="text-sm text-gray-500">Organic</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatNumber(data.totals.totalReferralTraffic)}</div>
              <div className="text-sm text-gray-500">Referral</div>
            </div>
            <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{formatNumber(data.totals.totalSocialTraffic)}</div>
              <div className="text-sm text-gray-500">Social</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatNumber(data.totals.totalEmailTraffic)}</div>
              <div className="text-sm text-gray-500">Email</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.daily.slice(-7).map((day, i) => {
                const maxViews = Math.max(...data.daily.map(d => d.pageViews))
                const width = (day.pageViews / maxViews) * 100
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-500">{day.date.slice(5)}</div>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">{day.pageViews}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.devices.map((item) => {
                const total = data.devices.reduce((sum, d) => sum + d.count, 0)
                const percentage = getPercentage(item.count, total)
                const Icon = deviceIcons[item.device || 'desktop'] || Monitor
                return (
                  <div key={item.device} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{item.device || 'Unknown'}</span>
                        <span className="text-sm text-gray-500">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium">{item.count}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed data */}
      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
          <TabsTrigger value="browsers">Browsers & OS</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="clicks">Click Events</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your site</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topPages.map((page) => (
                    <TableRow key={page.path}>
                      <TableCell className="font-mono text-sm">{page.path}</TableCell>
                      <TableCell className="text-right">{page.views}</TableCell>
                      <TableCell className="text-right">
                        {getPercentage(page.views, data.totals.totalPageViews)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Websites sending traffic to your site</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topReferrers.map((ref, i) => (
                    <TableRow key={i}>
                      <TableCell className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        {ref.host || 'Direct'}
                      </TableCell>
                      <TableCell className="text-right">{ref.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browsers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.browsers.slice(0, 5).map((item) => {
                    const total = data.browsers.reduce((sum, d) => sum + d.count, 0)
                    const Icon = browserIcons[item.browser || ''] || Globe2
                    return (
                      <div key={item.browser} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{item.browser || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {getPercentage(item.count, total)}%
                          </span>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.os.slice(0, 5).map((item) => {
                    const total = data.os.reduce((sum, d) => sum + d.count, 0)
                    return (
                      <div key={item.os} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                        <span>{item.os || 'Unknown'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {getPercentage(item.count, total)}%
                          </span>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {data.countries.slice(0, 10).map((item) => (
                  <div key={item.country} className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div className="text-sm text-gray-500">{item.country || 'Unknown'}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clicks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  Clicks by Element Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.clicks.byType.map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                      <span className="capitalize">{item.type || 'Unknown'}</span>
                      <Badge>{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clicked Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.clicks.top.slice(0, 10).map((item, i) => (
                    <div key={i} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.type}</Badge>
                        <span className="text-sm">{item.count} clicks</span>
                      </div>
                      {item.text && (
                        <div className="text-sm text-gray-500 mt-1 truncate">{item.text}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
