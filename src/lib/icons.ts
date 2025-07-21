
import {
  Activity, Airplay, AlarmClock, AlertTriangle, Archive, Award, BarChart, BatteryCharging, Bell, Book, Box, BrainCircuit, Briefcase, Brush, Building, Calendar, Camera, CheckCircle, Clipboard, Clock, Cloud, Code, Cog, Compass, Copy, CreditCard, Crop, Database, DollarSign, Download, Edit, ExternalLink, Eye, Feather, File, Filter, Flag, Folder, Gem, Gift, Globe, Grid, Heart, HelpCircle, Home, Image, Inbox, Info, Key, Laptop, Layers, LayoutGrid, LifeBuoy, Lightbulb, Link, List, Lock, Mail, Map, Maximize, Menu, MessageCircle, Mic, Minimize, Monitor, Moon, MoreHorizontal, MousePointer, Move, Music, Package, Paperclip, Pause, PenTool, Percent, Phone, PieChart, Play, Plus, Pocket, Power, Printer, Puzzle, RefreshCw, Repeat, Rocket, Save, Scissors, Search, Send, Server, Settings, Share2, Sheet, Shield, ShoppingBag, ShoppingCart, Sidebar, Signal, Sliders, Smartphone, Speaker, Star, Sun, Tag, Target, Terminal, ThumbsDown, ThumbsUp, ToggleLeft, ToggleRight, Trash2, TrendingUp, Truck, Type, Umbrella, Unlock, Upload, User, Users, Video, Voicemail, Volume2, Watch, Wifi, Wind, X, Youtube, Zap,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';

export const IconMap: { [key: string]: LucideIcon } = {
  Activity, Airplay, AlarmClock, AlertTriangle, Archive, Award, BarChart, BatteryCharging, Bell, Book, Box, BrainCircuit, Briefcase, Brush, Building, Calendar, Camera, CheckCircle, Clipboard, Clock, Cloud, Code, Cog, Compass, Copy, CreditCard, Crop, Database, DollarSign, Download, Edit, ExternalLink, Eye, Feather, File, Filter, Flag, Folder, Gem, Gift, Globe, Grid, Heart, HelpCircle, Home, Image, Inbox, Info, Key, Laptop, Layers, LayoutGrid, LifeBuoy, Lightbulb, Link, List, Lock, Mail, Map, Maximize, Menu, MessageCircle, Mic, Minimize, Monitor, Moon, MoreHorizontal, MousePointer, Move, Music, Package, Paperclip, Pause, PenTool, Percent, Phone, PieChart, Play, Plus, Pocket, Power, Printer, Puzzle, RefreshCw, Repeat, Rocket, Save, Scissors, Search, Send, Server, Settings, Share2, Sheet, Shield, ShoppingBag, ShoppingCart, Sidebar, Signal, Sliders, Smartphone, Speaker, Star, Sun, Tag, Target, Terminal, ThumbsDown, ThumbsUp, ToggleLeft, ToggleRight, Trash2, TrendingUp, Truck, Type, Umbrella, Unlock, Upload, User, Users, Video, Voicemail, Volume2, Watch, Wifi, Wind, X, Youtube, Zap,
};

export type IconName = keyof typeof IconMap;

export const ALL_ICONS = Object.keys(IconMap) as IconName[];

interface IconProps extends React.ComponentProps<LucideIcon> {
  name: IconName | string;
}

export function Icon({ name, ...props }: IconProps): React.ReactElement {
  const LucideIcon = IconMap[name as IconName];

  if (!LucideIcon) {
    return React.createElement(HelpCircle, props);
  }

  return React.createElement(LucideIcon, props);
}
