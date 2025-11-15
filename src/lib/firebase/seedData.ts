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
}

export interface TaskSeedData {
  title: string;
  status: 'In Progress' | 'Not Started' | 'Completed';
  nextStep: string;
  subtopic: string;
  priority: 'low' | 'medium' | 'high';
  relatedTopic: string;
  description?: string;
}

// Complete task catalog for each stream
export const streamTasksData: Record<string, TaskSeedData[]> = {
  "CyberDojo Stream": [
    {
      title: "Daily CyberDojo Challenge - Week 1",
      status: "In Progress",
      nextStep: "Complete Week 1 coding exercises",
      subtopic: "String Manipulation",
      priority: "medium",
      relatedTopic: "Arrays, Loops, Conditional Logic",
      description: "Daily coding katas focusing on string manipulation techniques"
    },
    {
      title: "Daily CyberDojo Challenge - Week 2",
      status: "Not Started",
      nextStep: "Prepare for Week 2 challenges",
      subtopic: "Functions & Methods",
      priority: "medium",
      relatedTopic: "Recursion, Problem Solving",
      description: "Advanced function design and recursive problem-solving"
    },
    {
      title: "Daily CyberDojo Challenge - Week 3",
      status: "Not Started",
      nextStep: "Plan practice sessions",
      subtopic: "File I/O",
      priority: "medium",
      relatedTopic: "Exception Handling",
      description: "File operations and error handling patterns"
    }
  ],
  "Computer Science Degree Stream": [
    {
      title: "Algorithms Assignment – Sorting",
      status: "In Progress",
      nextStep: "Implement quicksort, mergesort, heapsort",
      subtopic: "Sorting Algorithms",
      priority: "high",
      relatedTopic: "Complexity Analysis",
      description: "Deep dive into efficient sorting algorithm implementations"
    },
    {
      title: "Data Structures Practice",
      status: "In Progress",
      nextStep: "Complete linked list and tree exercises",
      subtopic: "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs",
      priority: "high",
      relatedTopic: "Time/Space Complexity",
      description: "Comprehensive data structure implementation and analysis"
    },
    {
      title: "Programming Assignments",
      status: "Not Started",
      nextStep: "Solve Java, Python, C++ exercises",
      subtopic: "Object-Oriented Programming, Recursion",
      priority: "medium",
      relatedTopic: "Algorithms & Problem Solving",
      description: "Multi-language programming challenges"
    },
    {
      title: "Theory Modules",
      status: "In Progress",
      nextStep: "Study OS, Networking, Databases fundamentals",
      subtopic: "Operating Systems, Networking, Databases",
      priority: "medium",
      relatedTopic: "Core CS Concepts",
      description: "Foundational computer science theory"
    }
  ],
  "Skillsoft / Percipio Stream": [
    {
      title: "Complete Security+ Module 3",
      status: "In Progress",
      nextStep: "Finish cryptography fundamentals",
      subtopic: "Cryptography, Network Security",
      priority: "medium",
      relatedTopic: "Access Control",
      description: "Advanced cryptographic concepts and network security"
    },
    {
      title: "Skillsoft Labs and Quizzes",
      status: "Not Started",
      nextStep: "Attempt lab exercises and assessments",
      subtopic: "Cybersecurity Practices",
      priority: "medium",
      relatedTopic: "Risk Management, Security Policies",
      description: "Hands-on security labs and certification prep"
    },
    {
      title: "Additional Security+ Modules",
      status: "Not Started",
      nextStep: "Study incident response, threat analysis",
      subtopic: "Security Operations",
      priority: "medium",
      relatedTopic: "Compliance & Governance",
      description: "Security operations and compliance frameworks"
    }
  ],
  "IBM Stream": [
    {
      title: "IBM QRadar SIEM Lab Setup",
      status: "In Progress",
      nextStep: "Complete initial configuration",
      subtopic: "SIEM Deployment",
      priority: "high",
      relatedTopic: "Event Monitoring, Threat Detection",
      description: "QRadar SIEM installation and configuration"
    },
    {
      title: "IBM Security Verify Access Lab",
      status: "Not Started",
      nextStep: "Configure access policies and authentication",
      subtopic: "Access Management",
      priority: "high",
      relatedTopic: "Authentication, Authorization",
      description: "Identity and access management implementation"
    },
    {
      title: "IBM Guardium Data Protection Lab",
      status: "Not Started",
      nextStep: "Configure database security",
      subtopic: "Database Security",
      priority: "high",
      relatedTopic: "Data Activity Monitoring",
      description: "Database security and compliance monitoring"
    }
  ],
  "Red Hat Stream": [
    {
      title: "Complete RHCSA Chapter 4 Lab",
      status: "In Progress",
      nextStep: "Work through exercises on file permissions and ACLs",
      subtopic: "File System Permissions",
      priority: "high",
      relatedTopic: "Security, Access Control",
      description: "Advanced file permissions and ACL configuration"
    },
    {
      title: "RHCSA Chapter 3 Lab",
      status: "Completed",
      nextStep: "Review man pages and info commands",
      subtopic: "Using Help & Documentation",
      priority: "medium",
      relatedTopic: "Command Line Proficiency",
      description: "Mastering Linux documentation and help systems"
    },
    {
      title: "Red Hat System Administration Exercises",
      status: "In Progress",
      nextStep: "Complete users/groups, file system navigation, process management tasks",
      subtopic: "Users & Groups, Processes",
      priority: "high",
      relatedTopic: "Linux Administration",
      description: "Core system administration tasks and process management"
    },
    {
      title: "RHEL VM Configuration",
      status: "Completed",
      nextStep: "Maintain VMware integration with open-vm-tools",
      subtopic: "Virtualization & Tools",
      priority: "medium",
      relatedTopic: "CLI Practice, System Tweaks",
      description: "VM optimization and integration tools"
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
    inProgressCount: 1,
    completedCount: 0
  },
  {
    name: "Computer Science Degree Stream",
    description: "Diploma + Bachelor's degree subjects: algorithms, data structures, system fundamentals, programming logic, OOP, DB concepts. Long-term academic foundation tasks. Algorithm assignments (e.g., sorting algorithms, recursion exercises). Theoretical exercises that anchor practical projects (Zurvan Full-Stack, labs, etc.).",
    color: "#7209B7",
    category: "Academic",
    priority: 2,
    overview: "Covers my Diploma and Bachelor's Degree in Computer Science plus current advanced studies. This stream represents long-term theoretical grounding in algorithms, data structures, programming principles, systems theory, and computing fundamentals that support all higher-level skills.",
    inProgressCount: 3,
    completedCount: 0
  },
  {
    name: "Skillsoft / Percipio Stream",
    description: "Security pathways: CBROPS, CEH, PenTest+, Security+, CySA+, CASP+, SCOR. Cloud pathways: Cloud Advocate, SRE, DevSecOps Specialty. Structured courses with guided training for practical knowledge. Complementary to hands-on labs in IBM & Red Hat streams.",
    color: "#FF6B35",
    category: "Training",
    priority: 3,
    overview: "Includes all cybersecurity and cloud certification pathways inside the i3 Bootcamp: CBROPS, CEH, Pentest+, Security+, CySA+, CASP+, SCOR, Cloud Advocate, DevSecOps, SRE, and more. This stream captures structured, guided, theory-focused training that complements hands-on practice.",
    inProgressCount: 1,
    completedCount: 0
  },
  {
    name: "IBM Stream",
    description: "IBM/i3 Bootcamp certifications: Security Verify Access V10.0, QRadar SIEM V7.5, Guardium Data Protection v12.x, Cloud Pak for AIOps v4.6, AIX v7.3. IBM-specific labs and exercises. DevSecOps, SRE, Cloud Advocate pathways within IBM ecosystems. Lab environment setups and simulations.",
    color: "#0F62FE",
    category: "Bootcamp",
    priority: 4,
    overview: "Covers all IBM certification options: Security Verify Access V10.0, QRadar SIEM V7.5, Guardium Data Protection v12.x, Cloud Pak for AIOps v4.6, AIX v7.3. Plus IBM Cloud Advocate, SRE content, DevSecOps content, and all tool-specific training. This stream consolidates everything required by the IBM/i3 bootcamp tracks.",
    inProgressCount: 1,
    completedCount: 0
  },
  {
    name: "Red Hat Stream",
    description: "RHCSA I & II labs (chapter-by-chapter). Local documentation command mastery (Chapter 3 completed). RHEL VM in VMware with bidirectional copy-paste setup. System admin tasks: user/group management, service control, package management, permissions. Ongoing lab exercises and command-line proficiency. Full Red Hat System Administration tracking within the bootcamp.",
    color: "#EE0000",
    category: "Certifications",
    priority: 5,
    overview: "Tracks all progress in Red Hat System Administration I & II — including Chapter 3 documentation mastery, RHEL VM setup on VMware, copy-paste configuration tweaks, lab work, command proficiency, service management, and RHCSA certification preparation.",
    inProgressCount: 2,
    completedCount: 2
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
      // Create stream
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
          estimatedMinutes: 60,
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

      console.log(`  📝 Created ${streamTasks.length} tasks for ${streamData.name}`);
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