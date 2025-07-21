
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/app/contact/actions';

const contactInfo = [
  {
    icon: Mail,
    title: 'MAIL US',
    details: ['rohitsengar02@gmail.com'],
  },
  {
    icon: Phone,
    title: 'CONTACT US',
    details: ['+91 9411800280'],
  },
  {
    icon: MapPin,
    title: 'LOCATION',
    details: ['Ghaziabad, UP', 'India'],
  },
];

const socialInfo = [
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Linkedin, href: '#' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(submitContactForm, { success: false, message: '' });
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        reset();
      }
    }
  }, [state, toast, reset]);


  return (
    <motion.section
      id="contact"
      className="relative bg-background text-primary py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
        <div className="absolute inset-0 z-0">
          <div className="shape-blob shape-1" />
          <div className="shape-blob shape-2" />
        </div>

      <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* Left Column: Contact Info */}
        <motion.div variants={itemVariants} className="space-y-12">
            <div>
              <h2 className="text-sm uppercase font-semibold text-muted-foreground mb-6">Contact Info</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground tracking-widest">{item.title}</h3>
                      {item.details.map((line, i) => (
                        <p key={i} className="text-base text-primary font-medium">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm uppercase font-semibold text-muted-foreground mb-4">Social Info</h2>
              <div className="flex items-center gap-4">
                 {socialInfo.map((social, index) => (
                    <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary hover:bg-accent/20 hover:text-accent transition-colors">
                        <social.icon className="w-6 h-6" />
                    </a>
                 ))}
              </div>
            </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div variants={itemVariants} className="bg-secondary/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
           <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Let's work <span className="text-accent">together.</span></h2>
           <p className="text-muted-foreground mb-8">We're excited to hear about your project.</p>
           
           <form action={formAction} className="space-y-6">
                <div className="relative">
                    <Input id="name" {...register('name')} placeholder="Name *" className="bg-input/50 border-border h-12" />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                 <div className="relative">
                    <Input id="email" {...register('email')} placeholder="Email *" className="bg-input/50 border-border h-12" />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
                 <div className="relative">
                    <Input id="phone" {...register('phone')} placeholder="Mobile Number" className="bg-input/50 border-border h-12" />
                </div>
                <div className="relative">
                    <Textarea id="message" {...register('message')} placeholder="Your Message *" rows={4} className="bg-input/50 border-border" />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                </div>
                 <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={isPending}>
                    {isPending ? <><Loader2 className="animate-spin mr-2" /> Sending...</> : <><Send className="mr-2 w-4 h-4" />Send Message</>}
                </Button>
           </form>
        </motion.div>

      </div>
    </motion.section>
  );
}
