package com.example.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.InputStream;
import java.io.ObjectInputStream;

@RestController
@RequestMapping("/api")
public class PayloadController {

    @PostMapping("/restore")
    public String restorePayload(InputStream is) throws Exception {
        // True Positive: Java native ObjectInputStream.readObject deserialization (RPM-SAST-DESER-05)
        ObjectInputStream ois = new ObjectInputStream(is);
        Object obj = ois.readObject();
        return obj.toString();
    }
}
