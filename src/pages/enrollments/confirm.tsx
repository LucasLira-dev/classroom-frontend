import { ShowView } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router";

type EnrollmentDetails = {
    id: number;
    class?: {
        id: number;
        name: string;
    },
    subject?: {
        id: string;
        name: string;
    },
    department?: {
        id: number;
        name: string;
    },
    teacher?: {
        id: string;
        name: string;
        email: string;
    }
}

export default function EnrollmentsConfirmPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const enrollment = (location.state as { enrollment: EnrollmentDetails })?.enrollment;


    if (!enrollment) {
        return (
            <ShowView className="class-view">
                <Card>
                <CardHeader>
                    <CardTitle>Enrollment</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                    No enrollment details found.
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/classes")}>
                    Browse Classes
                    </Button>
                </CardContent>
                </Card>
            </ShowView>
    );
    }

    return (
        <ShowView className="class-view space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Enrollment Confirmed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You have been enrolled successfully.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        { 
                            enrollment.department && (
                                <Badge variant="secondary">
                                    Department: {enrollment.department.name}
                                </Badge>
                            )
                        }
                        {
                            enrollment.class && (
                                <Badge variant="outline">
                                    Class: {enrollment.class.name}
                                </Badge>
                            )
                        }
                        {
                            enrollment.subject && (
                                <Badge variant="outline">
                                    Subject: {enrollment.subject.name}
                                </Badge>
                            )
                        }
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Class Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground"> Class </p>
                        <p className="text-base font-bold"> {enrollment.class?.name} </p>
                    </div>
                    <Separator />

                    <div>
                        <p className="text-sm text-muted-foreground"> Teacher </p>
                        <p className="text-base font-bold"> {enrollment.teacher?.name ?? 'Unknown'} </p>
                        <p className="text-[12px] text-muted-foreground"> {enrollment.teacher?.email ?? 'Unknown'} </p>
                    </div>
                    <Separator />

                    <div className="flex gap-2">
                        <Button
                        onClick={() => navigate('/classes')}>
                            View Class
                        </Button>
                        {
                            enrollment.class?.id && (
                                <Button
                                variant="outline"
                                onClick={() => navigate(`/classes/show/${enrollment.class?.id}`)}>
                                    Go to Class
                                </Button>
                            )
                        }
                    </div>
                </CardContent>
            </Card>
        </ShowView>
    );
}