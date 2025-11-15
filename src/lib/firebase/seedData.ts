import { collection, addDoc, serverTimestamp } from '@firebase/firestore';
import { db } from './config';

export interface StreamSeedData {
  name: string;
  description: string;
  color: string;
  category: string;
  priority: number;
  overview: string;
  inProgressCount: number;
  completedCount: number;
  nextDeadline?: string;
  lastActivityDate?: string;
}

export interface TaskSeedData {
  title: string;
  status: 'In Progress' | 'Not Started' | 'Completed';
  nextStep: string;
  subtopic: string;
  priority: 'low' | 'medium' | 'high';
  relatedTopic: string;
  description?: string;
  estimatedMinutes: number;
  deadline?: string;
  lastWorkedOn?: string;
}

// Complete task catalog for each stream with LIVE DATA
export const streamTasksData: Record<string, TaskSeedData[]> = {
  "CyberDojo Stream": [
    {
      title: "Daily CyberDojo Challenge - Week 1",
      status: "In Progress",
      nextStep: "Complete string kata challenges",
      subtopic: "String Manipulation",
      priority: "medium",
      relatedTopic: "Arrays, Loops, Conditional Logic",
      description: "Daily coding katas focusing on string manipulation techniques including reverse, palindrome, and pattern matching exercises",
      estimatedMinutes: 45,
      deadline: "2025-11-16",
      lastWorkedOn: "2025-11-15"
    },
    {
      title: "Array Processing Drills",
      status: "In Progress",
      nextStep: "Complete sorting and filtering exercises",
      subtopic: "Array Operations",
      priority: "medium",
      relatedTopic: "Data Structures, Algorithm Efficiency",
      description: "Practice array manipulation techniques: map, filter, reduce, sort algorithms",
      estimatedMinutes: 60,
      deadline: "2025-11-17",
      lastWorkedOn: "2025-11-14"
    },
    {
      title: "Recursion Mastery",
      status: "Not Started",
      nextStep: "Study factorial and fibonacci implementations",
      subtopic: "Recursive Algorithms",
      priority: "high",
      relatedTopic: "Problem Solving, Stack Operations",
      description: "Master recursive thinking through classic problems and tree traversals",
      estimatedMinutes: 90,
      deadline: "2025-11-20"
    },
    {
      title: "Daily CyberDojo Challenge - Week 2",
      status: "Not Started",
      nextStep: "Prepare for function composition challenges",
      subtopic: "Functions & Methods",
      priority: "medium",
      relatedTopic: "Higher-Order Functions, Closures",
      description: "Advanced function design patterns and functional programming concepts",
      estimatedMinutes: 50,
      deadline: "2025-11-23"
    },
    {
      title: "Data Structure Implementation",
      status: "Not Started",
      nextStep: "Implement linked list from scratch",
      subtopic: "Custom Data Structures",
      priority: "high",
      relatedTopic: "Memory Management, Pointers",
      description: "Build core data structures: linked lists, stacks, queues, hash tables",
      estimatedMinutes: 120,
      deadline: "2025-11-25"
    },
    {
      title: "Algorithm Optimization Challenge",
      status: "Not Started",
      nextStep: "Analyze time complexity of solutions",
      subtopic: "Performance Optimization",
      priority: "medium",
      relatedTopic: "Big O Notation, Space Complexity",
      description: "Optimize existing solutions for better time and space complexity",
      estimatedMinutes: 75,
      deadline: "2025-11-27"
    },
    {
      title: "Daily CyberDojo Challenge - Week 3",
      status: "Not Started",
      nextStep: "Plan file I/O practice sessions",
      subtopic: "File Operations",
      priority: "low",
      relatedTopic: "Exception Handling, Stream Processing",
      description: "Master file reading, writing, parsing and error handling patterns",
      estimatedMinutes: 55,
      deadline: "2025-11-30"
    }
  ],
  
  "Computer Science Degree Stream": [
    {
      title: "Algorithms Assignment – Sorting Algorithms",
      status: "In Progress",
      nextStep: "Implement and analyze quicksort efficiency",
      subtopic: "Sorting Algorithms",
      priority: "high",
      relatedTopic: "Divide & Conquer, Complexity Analysis",
      description: "Deep dive into quicksort, mergesort, heapsort with performance benchmarking and Big O analysis",
      estimatedMinutes: 180,
      deadline: "2025-11-18",
      lastWorkedOn: "2025-11-15"
    },
    {
      title: "Data Structures - Binary Trees",
      status: "In Progress",
      nextStep: "Complete BST insert, delete, search operations",
      subtopic: "Binary Search Trees",
      priority: "high",
      relatedTopic: "Tree Traversals, Balanced Trees",
      description: "Implement binary search tree with full CRUD operations and balancing algorithms",
      estimatedMinutes: 150,
      deadline: "2025-11-19",
      lastWorkedOn: "2025-11-14"
    },
    {
      title: "Graph Theory Assignment",
      status: "In Progress",
      nextStep: "Implement DFS and BFS traversals",
      subtopic: "Graph Algorithms",
      priority: "high",
      relatedTopic: "Shortest Path, Network Flow",
      description: "Study and implement graph representations, traversals, and pathfinding algorithms",
      estimatedMinutes: 200,
      deadline: "2025-11-22",
      lastWorkedOn: "2025-11-13"
    },
    {
      title: "Object-Oriented Design Project",
      status: "Not Started",
      nextStep: "Design class hierarchy for library system",
      subtopic: "OOP Principles",
      priority: "high",
      relatedTopic: "Design Patterns, SOLID Principles",
      description: "Create comprehensive OOP system demonstrating inheritance, polymorphism, encapsulation",
      estimatedMinutes: 240,
      deadline: "2025-11-25"
    },
    {
      title: "Operating Systems - Process Scheduling",
      status: "Not Started",
      nextStep: "Study Round Robin and Priority scheduling",
      subtopic: "OS Scheduling Algorithms",
      priority: "medium",
      relatedTopic: "CPU Management, Context Switching",
      description: "Analyze and simulate various process scheduling algorithms",
      estimatedMinutes: 120,
      deadline: "2025-11-28"
    },
    {
      title: "Database Design Project",
      status: "Not Started",
      nextStep: "Create ER diagram for e-commerce system",
      subtopic: "Database Normalization",
      priority: "medium",
      relatedTopic: "SQL, Transactions, ACID Properties",
      description: "Design normalized database schema with proper relationships and constraints",
      estimatedMinutes: 180,
      deadline: "2025-12-02"
    },
    {
      title: "Network Protocols Study",
      status: "Not Started",
      nextStep: "Review TCP/IP stack layers",
      subtopic: "Computer Networks",
      priority: "medium",
      relatedTopic: "HTTP, DNS, Routing Protocols",
      description: "Comprehensive study of network layers, protocols, and communication patterns",
      estimatedMinutes: 150,
      deadline: "2025-12-05"
    },
    {
      title: "Compiler Design - Lexical Analysis",
      status: "Not Started",
      nextStep: "Build tokenizer for simple language",
      subtopic: "Compiler Construction",
      priority: "low",
      relatedTopic: "Parsing, Syntax Trees, Code Generation",
      description: "Create lexer and parser for custom programming language",
      estimatedMinutes: 300,
      deadline: "2025-12-10"
    }
  ],
  
  "Skillsoft / Percipio Stream": [
    {
      title: "Security+ Module 3 - Cryptography",
      status: "In Progress",
      nextStep: "Complete symmetric vs asymmetric encryption exercises",
      subtopic: "Cryptographic Fundamentals",
      priority: "high",
      relatedTopic: "PKI, Digital Signatures, Hashing",
      description: "Master encryption algorithms, key management, and cryptographic protocols for Security+ certification",
      estimatedMinutes: 120,
      deadline: "2025-11-17",
      lastWorkedOn: "2025-11-15"
    },
    {
      title: "Network Security Fundamentals",
      status: "Not Started",
      nextStep: "Study firewall configurations and rules",
      subtopic: "Network Defense",
      priority: "high",
      relatedTopic: "IDS/IPS, VPN, Network Segmentation",
      description: "Comprehensive network security concepts including firewalls, VPNs, and intrusion detection",
      estimatedMinutes: 150,
      deadline: "2025-11-20"
    },
    {
      title: "Identity and Access Management",
      status: "Not Started",
      nextStep: "Learn AAA framework and RBAC",
      subtopic: "Access Control",
      priority: "high",
      relatedTopic: "Authentication, Authorization, SSO",
      description: "Study authentication methods, access control models, and identity management systems",
      estimatedMinutes: 100,
      deadline: "2025-11-23"
    },
    {
      title: "Threat Analysis and Response",
      status: "Not Started",
      nextStep: "Study incident response lifecycle",
      subtopic: "Incident Management",
      priority: "medium",
      relatedTopic: "Threat Intelligence, SIEM, Forensics",
      description: "Learn threat detection, analysis, and incident response procedures",
      estimatedMinutes: 130,
      deadline: "2025-11-26"
    },
    {
      title: "Cloud Security Concepts",
      status: "Not Started",
      nextStep: "Review shared responsibility model",
      subtopic: "Cloud Security",
      priority: "medium",
      relatedTopic: "AWS Security, Azure Security, GCP",
      description: "Understand cloud security architectures, compliance, and best practices",
      estimatedMinutes: 110,
      deadline: "2025-11-29"
    },
    {
      title: "Risk Management Framework",
      status: "Not Started",
      nextStep: "Study NIST risk assessment methodology",
      subtopic: "Risk Assessment",
      priority: "medium",
      relatedTopic: "Compliance, Governance, Policies",
      description: "Master risk identification, assessment, and mitigation strategies",
      estimatedMinutes: 90,
      deadline: "2025-12-02"
    },
    {
      title: "Penetration Testing Basics",
      status: "Not Started",
      nextStep: "Learn reconnaissance techniques",
      subtopic: "Ethical Hacking",
      priority: "low",
      relatedTopic: "Vulnerability Assessment, Exploitation",
      description: "Introduction to penetration testing methodology and tools",
      estimatedMinutes: 140,
      deadline: "2025-12-06"
    }
  ],
  
  "IBM Stream": [
    {
      title: "IBM QRadar SIEM Lab - Initial Setup",
      status: "In Progress",
      nextStep: "Complete data source configuration",
      subtopic: "SIEM Deployment",
      priority: "high",
      relatedTopic: "Log Collection, Event Correlation",
      description: "Install and configure QRadar SIEM v7.5, set up data sources, and create initial dashboards",
      estimatedMinutes: 180,
      deadline: "2025-11-16",
      lastWorkedOn: "2025-11-15"
    },
    {
      title: "QRadar - Custom Rule Creation",
      status: "Not Started",
      nextStep: "Define threat detection rules",
      subtopic: "Rule Management",
      priority: "high",
      relatedTopic: "Threat Detection, Alert Tuning",
      description: "Create custom correlation rules for specific threat patterns and attack scenarios",
      estimatedMinutes: 120,
      deadline: "2025-11-19"
    },
    {
      title: "IBM Security Verify Access Lab",
      status: "Not Started",
      nextStep: "Configure reverse proxy and policies",
      subtopic: "Access Management",
      priority: "high",
      relatedTopic: "SSO, MFA, Federation",
      description: "Deploy Security Verify Access V10.0 with authentication policies and SSO integration",
      estimatedMinutes: 200,
      deadline: "2025-11-22"
    },
    {
      title: "Guardium Data Protection Setup",
      status: "Not Started",
      nextStep: "Install Guardium collectors",
      subtopic: "Database Security",
      priority: "high",
      relatedTopic: "Data Activity Monitoring, Compliance",
      description: "Configure Guardium v12.x for database monitoring, auditing, and compliance reporting",
      estimatedMinutes: 160,
      deadline: "2025-11-25"
    },
    {
      title: "Cloud Pak for AIOps Configuration",
      status: "Not Started",
      nextStep: "Set up AI model training",
      subtopic: "AIOps Platform",
      priority: "medium",
      relatedTopic: "Event Management, Automation",
      description: "Deploy Cloud Pak for AIOps v4.6 with AI-driven incident management",
      estimatedMinutes: 240,
      deadline: "2025-11-30"
    },
    {
      title: "AIX v7.3 System Administration",
      status: "Not Started",
      nextStep: "Study SMIT and command-line tools",
      subtopic: "Unix Administration",
      priority: "medium",
      relatedTopic: "LVM, Security, Performance",
      description: "Master AIX system administration including storage management and security",
      estimatedMinutes: 180,
      deadline: "2025-12-05"
    },
    {
      title: "DevSecOps Pipeline Integration",
      status: "Not Started",
      nextStep: "Design secure CI/CD workflow",
      subtopic: "DevSecOps",
      priority: "medium",
      relatedTopic: "Jenkins, GitLab, Security Scanning",
      description: "Build automated security testing into CI/CD pipelines",
      estimatedMinutes: 150,
      deadline: "2025-12-08"
    }
  ],
  
  "Red Hat Stream": [
    {
      title: "RHCSA Chapter 4 Lab - File Permissions",
      status: "In Progress",
      nextStep: "Practice ACL configurations on test files",
      subtopic: "File System Permissions",
      priority: "high",
      relatedTopic: "chmod, chown, ACLs, SELinux",
      description: "Master standard and extended file permissions, ACLs, and SELinux context management",
      estimatedMinutes: 90,
      deadline: "2025-11-16",
      lastWorkedOn: "2025-11-15"
    },
    {
      title: "RHCSA Chapter 5 - User Management",
      status: "In Progress",
      nextStep: "Create users with custom home directories",
      subtopic: "Users & Groups",
      priority: "high",
      relatedTopic: "useradd, usermod, Password Policies",
      description: "User and group administration including password policies and sudo configuration",
      estimatedMinutes: 80,
      deadline: "2025-11-18",
      lastWorkedOn: "2025-11-14"
    },
    {
      title: "RHCSA Chapter 3 Lab - Documentation",
      status: "Completed",
      nextStep: "Review man pages proficiency",
      subtopic: "Help & Documentation",
      priority: "medium",
      relatedTopic: "man, info, /usr/share/doc",
      description: "Mastered using Linux documentation systems: man pages, info docs, and help commands",
      estimatedMinutes: 60,
      lastWorkedOn: "2025-11-10"
    },
    {
      title: "RHCSA Chapter 6 - Storage Management",
      status: "Not Started",
      nextStep: "Study LVM creation and management",
      subtopic: "Logical Volume Management",
      priority: "high",
      relatedTopic: "Partitions, LVM, File Systems",
      description: "Create and manage partitions, logical volumes, and file systems",
      estimatedMinutes: 120,
      deadline: "2025-11-20"
    },
    {
      title: "RHCSA Chapter 7 - Networking",
      status: "Not Started",
      nextStep: "Configure static IP with nmcli",
      subtopic: "Network Configuration",
      priority: "high",
      relatedTopic: "NetworkManager, nmcli, Firewall",
      description: "Network interface configuration, firewall rules, and troubleshooting",
      estimatedMinutes: 100,
      deadline: "2025-11-23"
    },
    {
      title: "RHEL VM Configuration - VMware Tools",
      status: "Completed",
      nextStep: "Maintain bidirectional clipboard",
      subtopic: "Virtualization Tools",
      priority: "low",
      relatedTopic: "open-vm-tools, Guest Additions",
      description: "Completed VMware integration with copy-paste and shared folders",
      estimatedMinutes: 45,
      lastWorkedOn: "2025-11-08"
    },
    {
      title: "RHCSA Chapter 8 - Process Management",
      status: "Not Started",
      nextStep: "Practice ps, top, kill commands",
      subtopic: "Process Control",
      priority: "medium",
      relatedTopic: "systemctl, cron, at",
      description: "Monitor and manage system processes, services, and scheduled tasks",
      estimatedMinutes: 85,
      deadline: "2025-11-26"
    },
    {
      title: "RHCSA Chapter 9 - Package Management",
      status: "Not Started",
      nextStep: "Use dnf for package installation",
      subtopic: "Software Management",
      priority: "medium",
      relatedTopic: "dnf, rpm, Repositories",
      description: "Install, update, and manage software packages using dnf/rpm",
      estimatedMinutes: 70,
      deadline: "2025-11-28"
    },
    {
      title: "RHCSA Exam Preparation",
      status: "Not Started",
      nextStep: "Take practice exam",
      subtopic: "Certification Prep",
      priority: "high",
      relatedTopic: "All RHCSA Topics",
      description: "Comprehensive review and hands-on practice for RHCSA certification exam",
      estimatedMinutes: 300,
      deadline: "2025-12-05"
    }
  ]
};

export const learningStreams: StreamSeedData[] = [
  {
    name: "CyberDojo Stream",
    description: "Daily coding katas for scripting, algorithms, debugging, and automation practice. Algorithmic thinking drills and problem-solving exercises. Repeated 'practice dojo' sessions to strengthen technical reasoning across stack. Focused short exercises for consistent skill sharpening. Small, repeated challenges for discipline in code logic.",
    color: "#06FFA5",
    category: "Practice",
    priority: 1,
    overview: "A continuous practice environment focused on drills, repetition, problem-solving, scripting, debugging, small challenges, and algorithmic reasoning. This stream represents disciplined daily sharpening of practical skills across the entire technical stack.",
    inProgressCount: 2,
    completedCount: 0,
    nextDeadline: "Nov 16, 2025",
    lastActivityDate: "2025-11-15"
  },
  {
    name: "Computer Science Degree Stream",
    description: "Diploma + Bachelor's degree subjects: algorithms, data structures, system fundamentals, programming logic, OOP, DB concepts. Long-term academic foundation tasks. Algorithm assignments (e.g., sorting algorithms, recursion exercises). Theoretical exercises that anchor practical projects (Zurvan Full-Stack, labs, etc.).",
    color: "#7209B7",
    category: "Academic",
    priority: 2,
    overview: "Covers my Diploma and Bachelor's Degree in Computer Science plus current advanced studies. This stream represents long-term theoretical grounding in algorithms, data structures, programming principles, systems theory, and computing fundamentals that support all higher-level skills.",
    inProgressCount: 3,
    completedCount: 0,
    nextDeadline: "Nov 18, 2025",
    lastActivityDate: "2025-11-15"
  },
  {
    name: "Skillsoft / Percipio Stream",
    description: "Security pathways: CBROPS, CEH, PenTest+, Security+, CySA+, CASP+, SCOR. Cloud pathways: Cloud Advocate, SRE, DevSecOps Specialty. Structured courses with guided training for practical knowledge. Complementary to hands-on labs in IBM & Red Hat streams.",
    color: "#FF6B35",
    category: "Training",
    priority: 3,
    overview: "Includes all cybersecurity and cloud certification pathways inside the i3 Bootcamp: CBROPS, CEH, Pentest+, Security+, CySA+, CASP+, SCOR, Cloud Advocate, DevSecOps, SRE, and more. This stream captures structured, guided, theory-focused training that complements hands-on practice.",
    inProgressCount: 1,
    completedCount: 0,
    nextDeadline: "Nov 17, 2025",
    lastActivityDate: "2025-11-15"
  },
  {
    name: "IBM Stream",
    description: "IBM/i3 Bootcamp certifications: Security Verify Access V10.0, QRadar SIEM V7.5, Guardium Data Protection v12.x, Cloud Pak for AIOps v4.6, AIX v7.3. IBM-specific labs and exercises. DevSecOps, SRE, Cloud Advocate pathways within IBM ecosystems. Lab environment setups and simulations.",
    color: "#0F62FE",
    category: "Bootcamp",
    priority: 4,
    overview: "Covers all IBM certification options: Security Verify Access V10.0, QRadar SIEM V7.5, Guardium Data Protection v12.x, Cloud Pak for AIOps v4.6, AIX v7.3. Plus IBM Cloud Advocate, SRE content, DevSecOps content, and all tool-specific training. This stream consolidates everything required by the IBM/i3 bootcamp tracks.",
    inProgressCount: 1,
    completedCount: 0,
    nextDeadline: "Nov 16, 2025",
    lastActivityDate: "2025-11-15"
  },
  {
    name: "Red Hat Stream",
    description: "RHCSA I & II labs (chapter-by-chapter). Local documentation command mastery (Chapter 3 completed). RHEL VM in VMware with bidirectional copy-paste setup. System admin tasks: user/group management, service control, package management, permissions. Ongoing lab exercises and command-line proficiency. Full Red Hat System Administration tracking within the bootcamp.",
    color: "#EE0000",
    category: "Certifications",
    priority: 5,
    overview: "Tracks all progress in Red Hat System Administration I & II — including Chapter 3 documentation mastery, RHEL VM setup on VMware, copy-paste configuration tweaks, lab work, command proficiency, service management, and RHCSA certification preparation.",
    inProgressCount: 2,
    completedCount: 2,
    nextDeadline: "Nov 16, 2025",
    lastActivityDate: "2025-11-15"
  }
];

export async function seedStreamsWithTasks(userId: string) {
  console.log('🌱 Starting comprehensive stream and task seeding for user:', userId);
  
  try {
    const streamsRef = collection(db, 'streams');
    const tasksRef = collection(db, 'tasks');
    const createdStreams = [];
    let totalTasksCreated = 0;

    for (const streamData of learningStreams) {
      // Create stream with enhanced data
      const streamDoc = {
        user_id: userId,
        name: streamData.name,
        description: streamData.description,
        color: streamData.color,
        category: streamData.category,
        priority: streamData.priority,
        progress: 0,
        total_tasks: 0,
        completed_tasks: 0,
        active: true,
        nextDeadline: streamData.nextDeadline,
        lastActivityDate: streamData.lastActivityDate,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const streamDocRef = await addDoc(streamsRef, streamDoc);
      console.log(`✅ Created stream: ${streamData.name}`);

      // Create tasks for this stream
      const streamTasks = streamTasksData[streamData.name] || [];
      let streamCompletedTasks = 0;

      for (const task of streamTasks) {
        const isCompleted = task.status === 'Completed';
        if (isCompleted) streamCompletedTasks++;

        const taskDoc = {
          user_id: userId,
          title: task.title,
          description: `${task.description}\n\nSubtopic: ${task.subtopic}\nNext Step: ${task.nextStep}\nRelated Topics: ${task.relatedTopic}`,
          status: task.status,
          completed: isCompleted,
          stream: streamData.name,
          stream_id: streamDocRef.id,
          priority: task.priority,
          subtopic: task.subtopic,
          next_step: task.nextStep,
          related_topic: task.relatedTopic,
          estimatedMinutes: task.estimatedMinutes,
          deadline: task.deadline,
          lastWorkedOn: task.lastWorkedOn,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        };

        await addDoc(tasksRef, taskDoc);
        totalTasksCreated++;
      }

      // Calculate progress percentage
      const totalTasks = streamTasks.length;
      const progress = totalTasks > 0 ? Math.round((streamCompletedTasks / totalTasks) * 100) : 0;

      // Update stream with task counts
      const { updateDoc, doc } = await import('@firebase/firestore');
      await updateDoc(doc(db, 'streams', streamDocRef.id), {
        total_tasks: totalTasks,
        completed_tasks: streamCompletedTasks,
        progress: progress
      });

      createdStreams.push({ 
        id: streamDocRef.id, 
        ...streamDoc,
        total_tasks: totalTasks,
        completed_tasks: streamCompletedTasks,
        progress: progress
      });

      console.log(`  📝 Created ${streamTasks.length} tasks for ${streamData.name} (${streamCompletedTasks} completed)`);
    }

    console.log('🎉 Successfully seeded', createdStreams.length, 'streams and', totalTasksCreated, 'tasks!');
    console.log('📊 Summary:');
    createdStreams.forEach(stream => {
      console.log(`  • ${stream.name}: ${stream.completed_tasks}/${stream.total_tasks} tasks (${stream.progress}%)`);
    });

    return { streams: createdStreams, tasksCreated: totalTasksCreated };
  } catch (error) {
    console.error('❌ Error seeding streams and tasks:', error);
    throw error;
  }
}

// Legacy function for backwards compatibility
export async function seedStreams(userId: string) {
  return seedStreamsWithTasks(userId);
}