"use client";

import { useRef, useEffect, useActionState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Mail, Loader2, KeyRound } from 'lucide-react';

import { login } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FeaturesBackground } from '@/components/elements/SplineScene';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
    const [formState, formAction, isPending] = useActionState(login, { error: null });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (formState?.error) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: formState.error,
            });
        }
    }, [formState, toast]);

    useGSAP(() => {
        gsap.from(containerRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2
        });
        gsap.from('.form-element', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            delay: 0.5
        });
    }, { scope: containerRef });

    return (
        <main className="relative h-screen w-full flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background/50" />
                <FeaturesBackground />
            </div>

            <div ref={containerRef} className="relative z-10 w-full max-w-md">
                <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="form-element text-3xl font-bold text-primary font-headline">
                            Admin Access
                        </h1>
                        <p className="form-element text-muted-foreground mt-2">
                            Please sign in to continue.
                        </p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div className="relative form-element">
                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                className="pl-10 py-6 text-base bg-input/50 border-border"
                            />
                        </div>
                        <div className="relative form-element">
                             <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="pl-10 py-6 text-base bg-input/50 border-border"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full form-element py-6 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 transform hover:scale-105"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}
