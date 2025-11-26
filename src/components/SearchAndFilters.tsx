import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, X, Calendar as CalendarIcon, Tag } from "lucide-react";
import { format } from "date-fns";
import type { Task, Stream } from "@/types";

export interface FilterState {
  searchQuery: string;
  stream: string;
  priority: string;
  status: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  tags: string[];
}

interface SearchAndFiltersProps {
  tasks: Task[];
  streams: Stream[];
  onFilterChange: (filteredTasks: Task[]) => void;
}

export const SearchAndFilters = ({ tasks, streams, onFilterChange }: SearchAndFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    stream: "all",
    priority: "all",
    status: "all",
    dateFrom: undefined,
    dateTo: undefined,
    tags: [],
  });

  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags || [])));

  // Apply filters
  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...tasks];

    // Search by title
    if (newFilters.searchQuery.trim()) {
      const query = newFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Filter by stream
    if (newFilters.stream !== "all") {
      filtered = filtered.filter(task => task.stream === newFilters.stream);
    }

    // Filter by priority
    if (newFilters.priority !== "all") {
      filtered = filtered.filter(task => task.priority === newFilters.priority);
    }

    // Filter by status
    if (newFilters.status === "completed") {
      filtered = filtered.filter(task => task.completed);
    } else if (newFilters.status === "incomplete") {
      filtered = filtered.filter(task => !task.completed);
    }

    // Filter by date range
    if (newFilters.dateFrom) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate >= newFilters.dateFrom!;
      });
    }
    if (newFilters.dateTo) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate <= newFilters.dateTo!;
      });
    }

    // Filter by tags
    if (newFilters.tags.length > 0) {
      filtered = filtered.filter(task =>
        newFilters.tags.every(tag => task.tags?.includes(tag))
      );
    }

    onFilterChange(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange("tags", newTags);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: "",
      stream: "all",
      priority: "all",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
      tags: [],
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.stream !== "all" ||
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.tags.length > 0;

  return (
    <Card className="p-4 cosmic-card">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks by title or description..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
            {/* Stream Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Stream
              </Label>
              <Select
                value={filters.stream}
                onValueChange={(value) => handleFilterChange("stream", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Streams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  {streams.map(stream => {
                    const streamName = stream.name || (stream as any).title || 'Unnamed Stream';
                    const displayName = typeof streamName === 'string' 
                      ? streamName.split('(')[0].trim() 
                      : 'Unnamed Stream';
                    return (
                      <SelectItem key={stream.id} value={streamName}>
                        {displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Priority
              </Label>
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Date Range
              </Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange("dateFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange("dateTo", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2 md:col-span-2 lg:col-span-4">
                <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                  <Tag className="h-3 w-3" />
                  Filter by Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Active Filters:
            </span>
            {filters.searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.searchQuery}
                <button onClick={() => handleFilterChange("searchQuery", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.stream !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Stream: {filters.stream}
                <button onClick={() => handleFilterChange("stream", "all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.priority !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Priority: {filters.priority}
                <button onClick={() => handleFilterChange("priority", "all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <button onClick={() => handleFilterChange("status", "all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.dateFrom && (
              <Badge variant="secondary" className="gap-1">
                From: {format(filters.dateFrom, "MMM dd, yyyy")}
                <button onClick={() => handleFilterChange("dateFrom", undefined)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.dateTo && (
              <Badge variant="secondary" className="gap-1">
                To: {format(filters.dateTo, "MMM dd, yyyy")}
                <button onClick={() => handleFilterChange("dateTo", undefined)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                Tag: {tag}
                <button onClick={() => handleTagToggle(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
