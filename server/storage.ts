import {
  users,
  leads,
  properties,
  contacts,
  appointments,
  tasks,
  documents,
  activities,
  type User,
  type UpsertUser,
  type Lead,
  type InsertLead,
  type Property,
  type InsertProperty,
  type Contact,
  type InsertContact,
  type Appointment,
  type InsertAppointment,
  type Task,
  type InsertTask,
  type Document,
  type InsertDocument,
  type Activity,
  type InsertActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(userId?: string): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  getLeadsByStatus(status: string): Promise<Lead[]>;

  // Property operations
  createProperty(property: InsertProperty): Promise<Property>;
  getProperties(userId?: string): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: number): Promise<void>;
  getPropertiesByStatus(status: string): Promise<Property[]>;

  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(userId?: string): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact>;
  deleteContact(id: number): Promise<void>;

  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(userId?: string): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  getUpcomingAppointments(userId?: string): Promise<Appointment[]>;

  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  getTasks(userId?: string): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  getTasksByStatus(status: string): Promise<Task[]>;

  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocuments(userId?: string): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: number): Promise<void>;

  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivities(userId?: string): Promise<Activity[]>;
  getRecentActivities(userId?: string, limit?: number): Promise<Activity[]>;

  // Dashboard stats
  getDashboardStats(userId?: string): Promise<{
    totalLeads: number;
    activeProperties: number;
    upcomingAppointments: number;
    completedTasks: number;
    recentActivities: Activity[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    
    // Create activity
    await this.createActivity({
      title: "New lead added",
      description: `Lead ${lead.firstName} ${lead.lastName} has been added to the system`,
      activityType: "lead_created",
      entityType: "lead",
      entityId: newLead.id,
      userId: lead.assignedTo,
    });
    
    return newLead;
  }

  async getLeads(userId?: string): Promise<Lead[]> {
    const query = db.select().from(leads).orderBy(desc(leads.createdAt));
    
    if (userId) {
      return await query.where(eq(leads.assignedTo, userId));
    }
    
    return await query;
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead> {
    const [updatedLead] = await db
      .update(leads)
      .set({ ...lead, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updatedLead;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .where(eq(leads.status, status))
      .orderBy(desc(leads.createdAt));
  }

  // Property operations
  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    
    // Create activity
    await this.createActivity({
      title: "Property listed",
      description: `Property "${property.title}" has been listed`,
      activityType: "property_created",
      entityType: "property",
      entityId: newProperty.id,
      userId: property.listingAgent,
    });
    
    return newProperty;
  }

  async getProperties(userId?: string): Promise<Property[]> {
    const query = db.select().from(properties).orderBy(desc(properties.createdAt));
    
    if (userId) {
      return await query.where(eq(properties.listingAgent, userId));
    }
    
    return await query;
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  async getPropertiesByStatus(status: string): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.status, status))
      .orderBy(desc(properties.createdAt));
  }

  // Contact operations
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    
    // Create activity
    await this.createActivity({
      title: "Contact added",
      description: `Contact ${contact.firstName} ${contact.lastName} has been added`,
      activityType: "contact_created",
      entityType: "contact",
      entityId: newContact.id,
      userId: contact.assignedTo,
    });
    
    return newContact;
  }

  async getContacts(userId?: string): Promise<Contact[]> {
    const query = db.select().from(contacts).orderBy(desc(contacts.createdAt));
    
    if (userId) {
      return await query.where(eq(contacts.assignedTo, userId));
    }
    
    return await query;
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact> {
    const [updatedContact] = await db
      .update(contacts)
      .set({ ...contact, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return updatedContact;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    
    // Create activity
    await this.createActivity({
      title: "Appointment scheduled",
      description: `Appointment "${appointment.title}" has been scheduled`,
      activityType: "appointment_scheduled",
      entityType: "appointment",
      entityId: newAppointment.id,
      userId: appointment.assignedTo,
    });
    
    return newAppointment;
  }

  async getAppointments(userId?: string): Promise<Appointment[]> {
    const query = db.select().from(appointments).orderBy(desc(appointments.startTime));
    
    if (userId) {
      return await query.where(eq(appointments.assignedTo, userId));
    }
    
    return await query;
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...appointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  async getUpcomingAppointments(userId?: string): Promise<Appointment[]> {
    const query = db
      .select()
      .from(appointments)
      .where(and(
        eq(appointments.status, "scheduled"),
        sql`${appointments.startTime} > NOW()`
      ))
      .orderBy(appointments.startTime);
    
    if (userId) {
      return await query.where(eq(appointments.assignedTo, userId));
    }
    
    return await query;
  }

  // Task operations
  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    
    // Create activity
    await this.createActivity({
      title: "Task created",
      description: `Task "${task.title}" has been created`,
      activityType: "task_created",
      entityType: "task",
      entityId: newTask.id,
      userId: task.assignedTo,
    });
    
    return newTask;
  }

  async getTasks(userId?: string): Promise<Task[]> {
    const query = db.select().from(tasks).orderBy(desc(tasks.createdAt));
    
    if (userId) {
      return await query.where(eq(tasks.assignedTo, userId));
    }
    
    return await query;
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.status, status))
      .orderBy(desc(tasks.createdAt));
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    
    // Create activity
    await this.createActivity({
      title: "Document uploaded",
      description: `Document "${document.title}" has been uploaded`,
      activityType: "document_uploaded",
      entityType: "document",
      entityId: newDocument.id,
      userId: document.uploadedBy,
    });
    
    return newDocument;
  }

  async getDocuments(userId?: string): Promise<Document[]> {
    const query = db.select().from(documents).orderBy(desc(documents.createdAt));
    
    if (userId) {
      return await query.where(eq(documents.uploadedBy, userId));
    }
    
    return await query;
  }

  async getDocumentById(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document> {
    const [updatedDocument] = await db
      .update(documents)
      .set({ ...document, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Activity operations
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getActivities(userId?: string): Promise<Activity[]> {
    const query = db.select().from(activities).orderBy(desc(activities.createdAt));
    
    if (userId) {
      return await query.where(eq(activities.userId, userId));
    }
    
    return await query;
  }

  async getRecentActivities(userId?: string, limit: number = 10): Promise<Activity[]> {
    const query = db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
    
    if (userId) {
      return await query.where(eq(activities.userId, userId));
    }
    
    return await query;
  }

  // Dashboard stats
  async getDashboardStats(userId?: string): Promise<{
    totalLeads: number;
    activeProperties: number;
    upcomingAppointments: number;
    completedTasks: number;
    recentActivities: Activity[];
  }> {
    const userFilter = userId ? eq(leads.assignedTo, userId) : undefined;
    const propertyUserFilter = userId ? eq(properties.listingAgent, userId) : undefined;
    const appointmentUserFilter = userId ? eq(appointments.assignedTo, userId) : undefined;
    const taskUserFilter = userId ? eq(tasks.assignedTo, userId) : undefined;
    const activityUserFilter = userId ? eq(activities.userId, userId) : undefined;

    const [totalLeadsResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(userFilter);

    const [activePropertiesResult] = await db
      .select({ count: count() })
      .from(properties)
      .where(and(
        eq(properties.status, "available"),
        propertyUserFilter
      ));

    const [upcomingAppointmentsResult] = await db
      .select({ count: count() })
      .from(appointments)
      .where(and(
        eq(appointments.status, "scheduled"),
        sql`${appointments.startTime} > NOW()`,
        appointmentUserFilter
      ));

    const [completedTasksResult] = await db
      .select({ count: count() })
      .from(tasks)
      .where(and(
        eq(tasks.status, "completed"),
        taskUserFilter
      ));

    const recentActivities = await db
      .select()
      .from(activities)
      .where(activityUserFilter)
      .orderBy(desc(activities.createdAt))
      .limit(5);

    return {
      totalLeads: totalLeadsResult.count,
      activeProperties: activePropertiesResult.count,
      upcomingAppointments: upcomingAppointmentsResult.count,
      completedTasks: completedTasksResult.count,
      recentActivities,
    };
  }
}

export const storage = new DatabaseStorage();
