package io.openvidu.classroom.demo.lesson;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import io.openvidu.classroom.demo.user.User;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
	
    public Collection<Lesson> findByAttenders(Collection<User> users);

}
