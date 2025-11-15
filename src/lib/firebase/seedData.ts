import { collection, addDoc, serverTimestamp } from '@firebase/firestore';
import { db } from './config';

export interface StreamSeedData {
  title: string;
  description: string;
  color: string;
  category: string;
  priority: number;
}

export const learningStreams: StreamSeedData[] = [
  {
    title: "CyberDojo Stream (Daily Skill Sharpening)",
    description: "A continuous practice environment focused on drills, repetition, problem-solving, scripting, debugging, small challenges, and algorithmic reasoning. This stream represents disciplined daily sharpening of practical skills across the entire technical stack.",
    color: "#06FFA5", // Cyan for practice
    category: "Practice",
    priority: 1
  },
  {
    title: "Computer Science Degree Stream (Academic Foundation)",
    description: "Covers my Diploma and Bachelor's Degree in Computer Science plus current advanced studies. This stream represents long-term theoretical grounding in algorithms, data structures, programming principles, systems theory, and computing fundamentals that support all higher-level skills.",
    color: "#7209B7", // Purple for academics
    category: "Academic",
    priority: 2
  },
  {
    title: "Skillsoft / Percipio Stream (Structured Guided Learning)",
    description: "Includes all cybersecurity and cloud certification pathways inside the i3 Bootcamp: CBROPS, CEH, Pentest+, Security+, CySA+, CASP+, SCOR, Cloud Advocate, DevSecOps, SRE, and more. This stream captures structured, guided, theory-focused training that complements hands-on practice.",
    color: "#FF6B35", // Orange for learning
    category: "Training",
    priority: 3
  },
  {
    title: "IBM/i3 Bootcamp Stream (Certification & Tooling Mastery)",
    description: "Covers all IBM certification options: Security Verify Access V10.0, QRadar SIEM V7.5, Guardium Data Protection v12.x, Cloud Pak for AIOps v4.6, AIX v7.3. Plus IBM Cloud Advocate, SRE content, DevSecOps content, and all tool-specific training. This stream consolidates everything required by the IBM/i3 bootcamp tracks.",
    color: "#0F62FE", // IBM blue
    category: "Bootcamp",
    priority: 4
  },
  {
    title: "Red Hat Stream (Systems Administration & RHCSA Path)",
    description: "Tracks all progress in Red Hat System Administration I & II — including Chapter 3 documentation mastery, RHEL VM setup on VMware, copy-paste configuration tweaks, lab work, command proficiency, service management, and RHCSA certification preparation.",
    color: "#EE0000", // Red Hat red
    category: "Certifications",
    priority: 5
  }
];

export async function seedStreams(userId: string) {
  console.log('🌱 Starting stream seeding for user:', userId);
  
  try {
    const streamsRef = collection(db, 'streams');
    const createdStreams = [];

    for (const stream of learningStreams) {
      const streamData = {
        ...stream,
        user_id: userId,
        progress: 0,
        total_tasks: 0,
        completed_tasks: 0,
        active: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const docRef = await addDoc(streamsRef, streamData);
      createdStreams.push({ id: docRef.id, ...streamData });
      console.log(`✅ Created stream: ${stream.title}`);
    }

    console.log('🎉 Successfully seeded', createdStreams.length, 'streams!');
    return createdStreams;
  } catch (error) {
    console.error('❌ Error seeding streams:', error);
    throw error;
  }
}

export async function seedSampleTasks(userId: string, streamIds: { [key: string]: string }) {
  console.log('🌱 Starting task seeding for user:', userId);
  
  try {
    const tasksRef = collection(db, 'tasks');
    const sampleTasks = [
      {
        title: "Complete RHCSA Chapter 4 Lab",
        description: "Work through all exercises in Chapter 4 focusing on file permissions and ACLs",
        stream_id: streamIds['red_hat'],
        priority: "high",
        status: "todo",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        estimated_duration: 120, // minutes
        tags: ["lab", "rhcsa", "permissions"]
      },
      {
        title: "IBM QRadar SIEM Lab Setup",
        description: "Set up QRadar SIEM v7.5 virtual environment and complete initial configuration",
        stream_id: streamIds['ibm'],
        priority: "high",
        status: "in_progress",
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        estimated_duration: 180,
        tags: ["ibm", "siem", "security"]
      },
      {
        title: "Complete Security+ Module 3",
        description: "Finish Skillsoft Security+ certification module on cryptography fundamentals",
        stream_id: streamIds['skillsoft'],
        priority: "medium",
        status: "todo",
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        estimated_duration: 90,
        tags: ["security+", "cryptography", "certification"]
      },
      {
        title: "Algorithms Assignment - Sorting Algorithms",
        description: "Implement and analyze quicksort, mergesort, and heapsort with complexity analysis",
        stream_id: streamIds['cs_degree'],
        priority: "high",
        status: "todo",
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        estimated_duration: 240,
        tags: ["algorithms", "assignment", "sorting"]
      },
      {
        title: "Daily CyberDojo Challenge - Week 1",
        description: "Complete 5 coding challenges focusing on string manipulation and array operations",
        stream_id: streamIds['cyberdojo'],
        priority: "medium",
        status: "in_progress",
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        estimated_duration: 60,
        tags: ["practice", "algorithms", "daily"]
      }
    ];

    const createdTasks = [];
    for (const task of sampleTasks) {
      const taskData = {
        ...task,
        user_id: userId,
        completed: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const docRef = await addDoc(tasksRef, taskData);
      createdTasks.push({ id: docRef.id, ...taskData });
      console.log(`✅ Created task: ${task.title}`);
    }

    console.log('🎉 Successfully seeded', createdTasks.length, 'tasks!');
    return createdTasks;
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
    throw error;
  }
}